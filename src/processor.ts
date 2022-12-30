import {lookupArchive} from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import {BatchContext, BatchProcessorItem, decodeHex, SubstrateBatchProcessor, toHex} from "@subsquid/substrate-processor"
import {createLogger} from "@subsquid/logger"
import {Big} from 'big.js'
import assert from "assert"
import * as fs from 'fs'
import {XcmPalletLimitedReserveTransferAssetsCall, XcmPalletLimitedTeleportAssetsCall, XcmPalletReserveTransferAssetsCall, XcmPalletTeleportAssetsCall} from "./types/calls"
import {Call} from "./types/support"
import { CsvDatabase, Table, types, Store, List, Struct, TableRecord } from "@subsquid/duckdb-store"

const log = createLogger("sqd:processor")
const CSV_PATH = `${__dirname}/../assets/xcm_transfers.csv`

const EVM_PARA_IDS = [2023]
const PLANKS = new Big(1_000_000_000_000n.toString()) // 10^12

const processor = new SubstrateBatchProcessor()
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


type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

const XcmTransfers = new Table('transfers', {
    id: types.string,
    blockNumber: types.int,
    timestamp: types.timestamp,
    extrinsicHash: {type: types.string, nullable: true},
    from: types.string,
    to: Struct({
        paraId: types.int,
        id: types.string,
        address: types.string
    }),
    assets: List(Struct({
        token: types.string,
        amount: types.string,
    })),
    fee: types.string,
})

log.info(`Writing to ${CSV_PATH}`)
const db = new CsvDatabase([XcmTransfers], {
    dest: CSV_PATH,
    chunkSize: 10,
    updateInterval: 100_000,
})

processor.run(db, async ctx => {    
    let transfersData = getTransfers(ctx)


    // const writeXCMTransferData = (t: XcmTransferData) => {
    //     for (let a of t.assets) {
             
    //         csvWriter.write(`${t.id},${t.blockNumber},${t.timestamp.getTime()},`+
    //           `${t.extrinsicHash},${t.from},${t.to.address},${t.to.paraId},`+
    //           `${a.token},${toKSMAmount(a.amount)},${toKSMAmount(t.fee ?? 0n, 10)}\n`)
    //     }
    // }

    // for (let t of transfersData) {
    //     writeXCMTransferData(t)
    // }
    ctx.store.write(XcmTransfers, transfersData)

})

type Record = TableRecord<typeof XcmTransfers>

function getTransfers(ctx: Ctx): Record[] {

    const toKSMAmount = (planks: bigint | number, precision = 5) =>
        new Big(planks.toString()).div(PLANKS).toFixed(precision).toString()

    let transfers: Record[] = []

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
                const beneficiary = getBeneficiary(data.beneficiary)
                const assets = getAssets(data.assets)

                const from = (
                    signature.address.__kind == 'Id' || signature.address.__kind == 'AccountId'
                        ? signature.address.value
                        : signature.address
                ) as string
                let destAddress = EVM_PARA_IDS.includes(dest) ? beneficiary : ss58.codec('kusama').encode(decodeHex(beneficiary))
                
                transfers.push({
                    id,
                    blockNumber: block.header.height,
                    timestamp: new Date(block.header.timestamp),
                    extrinsicHash: hash,
                    from: ss58.codec('kusama').encode(decodeHex(from)),
                    to: {
                        paraId: dest,
                        address: destAddress,
                        id: beneficiary
                    },
                    assets: assets.map(a => ({
                        token: 'KSM',
                        amount: toKSMAmount(a.amount),
                    })),
                    fee: toKSMAmount(fee ?? 0n, 10)
                })
            } catch (e) {
                ctx.log.warn(`${e}\nextrinsic: ${item.extrinsic.hash}\nblock: ${block.header.height}`)
            }
        }
    }
    return transfers
}

function getBeneficiary(value: any) {
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
        id: string,
        address: string
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