import {lookupArchive} from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import {BatchContext, BatchProcessorItem, decodeHex, SubstrateBatchProcessor, toHex} from "@subsquid/substrate-processor"
import {Store, TypeormDatabase} from "@subsquid/typeorm-store"
import assert from "assert"
import {In} from "typeorm"
import {Account, Transfer, XcmDestination, XcmToken} from "./model"
import {XcmPalletLimitedReserveTransferAssetsCall, XcmPalletLimitedTeleportAssetsCall, XcmPalletReserveTransferAssetsCall, XcmPalletTeleportAssetsCall} from "./types/calls"
import {BalancesTransferEvent} from "./types/events"
import {Call} from "./types/support"


const processor = new SubstrateBatchProcessor()
    .setBatchSize(500)
    .setDataSource({
        archive: lookupArchive("kusama", {release: "FireSquid"})
    })
    .addCall('XcmPallet.teleport_assets', {
        data: {
            call: true,
            extrinsic: true
        }
    })
    .addCall('XcmPallet.reserve_transfer_assets', {
        data: {
            call: true,
            extrinsic: true
        }
    })
    .addCall('XcmPallet.limited_teleport_assets', {
        data: {
            call: true,
            extrinsic: true
        }
    })
    .addCall('XcmPallet.limited_reserve_transfer_assets', {
        data: {
            call: true,
            extrinsic: true
        }
    })


type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>


processor.run(new TypeormDatabase(), async ctx => {
    let transfersData = getTransfers(ctx)

    let accountIds = new Set<string>()
    for (let t of transfersData) {
        accountIds.add(t.from)
    }

    let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then(accounts => {
        return new Map(accounts.map(a => [a.id, a]))
    })

    let transfers: Transfer[] = []

    for (let t of transfersData) {
        let {id, blockNumber, timestamp, extrinsicHash, assets, fee, to} = t

        let from = getAccount(accounts, t.from)

        transfers.push(new Transfer({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            from,
            to: new XcmDestination(to),
            assets: assets.map(a => new XcmToken({...a})),
            fee
        }))
    }

    await ctx.store.save(Array.from(accounts.values()))
    await ctx.store.insert(transfers)
})

function getTransfers(ctx: Ctx): XcmTransferData[] {
    let transfers: XcmTransferData[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            let data: XcmTransferEventData | undefined
            switch (item.name) {
                case 'XcmPallet.teleport_assets':
                    data = getXcmTeleportAssets(ctx, item.call)
                    break
                case 'XcmPallet.limited_teleport_assets':
                    data = getXcmLimitedTeleportAssets(ctx, item.call)
                    break
                case 'XcmPallet.reserve_transfer_assets':
                    data = getReservedTeleportAssets(ctx, item.call)
                    break
                case 'XcmPallet.limited_reserve_transfer_assets':
                    data = getLimitedReservedTeleportAssets(ctx, item.call)
                    break
                default:
                    continue
            }

            const {hash, signature, id, fee} = item.extrinsic
            if (signature?.address == null) continue

            try {
                const dest = getDestination(data.dest)
                const beneficiary = getBeneficiare(data.beneficiary)
                const assets = getAssets(data.assets)

                const from = (
                    signature.address.__kind == 'Id' || signature.address.__kind == 'AccountId'
                        ? signature.address.value
                        : signature.address
                ) as string

                transfers.push({
                    id,
                    blockNumber: block.header.height,
                    timestamp: new Date(block.header.timestamp),
                    extrinsicHash: hash,
                    from: ss58.codec('kusama').encode(decodeHex(from)),
                    to: {
                        paraId: dest,
                        id: beneficiary
                    },
                    assets: assets.map(a => ({
                        token: 'KSM',
                        amount: a.amount,
                    })),
                    fee: fee || 0n
                })
            } catch (e) {
                ctx.log.warn(`${e}\nextrinsic: ${item.extrinsic.hash}\nblock: ${block.header.height}`)
            }
        }
    }
    return transfers
}

function getBeneficiare(value: any) {
    switch (value.__kind) {
        case 'V0':
            return getAccountId(value.value)
        case 'V1':
        case 'V2':
            return getAccountId(value.value.interior)
        default:
            throw new Error(`Unsupported beneficiare version: ${value.__kind}`)
    }
}

function getAssets(value: any): {id: null, amount: bigint}[] {
    const version = value.__kind

    switch (version) {
        case 'V0': {
            return value.value.map((asset: any) => {
                assert(asset.__kind === 'ConcreteFungible', `Unsupported asset variant ${asset.__kind}`)

                switch (asset.id.__kind) {
                    case 'X1':
                        assert(asset.id.value.__kind === 'Parent', `Unsupported asset id variant ${asset.id.value.__kind}`)
                        return {
                            id: null,
                            amount: asset.amount
                        }
                    case 'Here':
                    case 'Null':
                        return {
                            id: null,
                            amount: asset.amount
                        }
                    default:
                        throw new Error(`Unsupported asset id variant ${asset.id.__kind}`)
                }
            })
        }
        case 'V1':
        case 'V2': {
            return value.value.map((asset: any) => {
                assert(asset.id.__kind === 'Concrete', `Unsupported asset variant ${asset.id.__kind}`)

                assert(asset.id.value.interior.__kind === 'Here', `Unsupported asset id variant ${asset.id.value.interior.__kind}`)

                const fun = (asset as any).fungibility || (asset as any).fun

                assert(fun.__kind === 'Fungible', `Unsupported asset fungibility variant ${fun.__kind}`)

                return {
                    id: null,
                    amount: fun.value
                }
            })
        }
        default:
            throw new Error()
    }
}

interface XcmTransferData {
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    from: string
    to: {
        paraId: number,
        id: string
    }
    assets: {
        token: string,
        amount: bigint
    }[]
    fee?: bigint
}

type XcmTransferEventData = ReturnType<typeof getXcmTeleportAssets>

function getXcmTeleportAssets(ctx: Ctx, call: Call) {
    const data = new XcmPalletTeleportAssetsCall(ctx, call)

    if (data.isV9010) {
        const {dest, beneficiary, assets} = data.asV9010
        return {
            dest: {__kind: 'V0' as const, value: dest},
            beneficiary: {__kind: 'V0' as const, value: beneficiary},
            assets: {__kind: 'V0' as const, value: assets},
        }
    } else if (data.isV9100) {
        return data.asV9100
    } else if (data.isV9111) {
        return data.asV9111
    } else {
        throw new Error()
    }
}

function getXcmLimitedTeleportAssets(ctx: Ctx, call: Call) {
    const data = new XcmPalletLimitedTeleportAssetsCall(ctx, call)

    if (data.isV9122) {
        return data.asV9122
    } else {
        throw new Error()
    }
}

function getReservedTeleportAssets(ctx: Ctx, call: Call): XcmTransferEventData {
    const data = new XcmPalletReserveTransferAssetsCall(ctx, call)

    if (data.isV9030) {
        const {dest, beneficiary, assets} = data.asV9030
        return {
            dest: {__kind: 'V0' as const, value: dest},
            beneficiary: {__kind: 'V0' as const, value: beneficiary},
            assets: {__kind: 'V0' as const, value: assets},
        }
    } else if (data.isV9100) {
        return data.asV9100
    } else if (data.isV9111) {
        return data.asV9111
    } else {
        throw new Error()
    }
}

function getLimitedReservedTeleportAssets(ctx: Ctx, call: Call) {
    const data = new XcmPalletLimitedReserveTransferAssetsCall(ctx, call)

    if (data.isV9122) {
        return data.asV9122
    } else {
        throw new Error()
    }
}

function getAccount(m: Map<string, Account>, id: string): Account {
    let acc = m.get(id)
    if (acc == null) {
        acc = new Account()
        acc.id = id
        m.set(id, acc)
    }
    return acc
}

export function getDestination(value: any) {
    switch (value.__kind) {
        case 'V0':
            return getParachainId(value.value)
        case 'V1':
        case 'V2':
            return getParachainId(value.value.interior)
        default:
            throw new Error(`Unsupported destination version: ${value.__kind}`)
    }
}

function getAccountId(value: any): string {
    switch (value.__kind) {
        case 'X1':
            switch (value.value.__kind) {
                case 'AccountId32':
                    return toHex(value.value.id)
                case 'AccountKey20':
                    return toHex(value.value.key)
                default:
                    throw new Error(`Unsupported account id variant: ${value.value.__kind}`)
            }
        default:
            throw new Error(`Unsupported account location variant: ${value.__kind}`)
    }
}

function getParachainId(value: any): number {
    switch (value.__kind) {
        case 'X1':
            switch (value.value.__kind) {
                case 'Parachain':
                    return value.value.value
                default:
                    throw new Error(`Unsupported parachain id variant: ${value.value.__kind}`)
            }
        default:
            throw new Error(`Unsupported parachain location variant: ${value.__kind}`)
    }
}