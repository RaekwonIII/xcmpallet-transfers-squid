import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'
import * as v9010 from './v9010'
import * as v9030 from './v9030'
import * as v9100 from './v9100'
import * as v9111 from './v9111'
import * as v9122 from './v9122'

export class XcmPalletLimitedReserveTransferAssetsCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'XcmPallet.limited_reserve_transfer_assets')
    this._chain = ctx._chain
    this.call = call
  }

  /**
   * Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   * a notification XCM.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  get isV9122(): boolean {
    return this._chain.getCallHash('XcmPallet.limited_reserve_transfer_assets') === '3c203a3f95b9fe53b8c376802c4fe60fa6077815af7432dcd2a3e458169a5d2a'
  }

  /**
   * Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   * a notification XCM.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  get asV9122(): {dest: v9122.VersionedMultiLocation, beneficiary: v9122.VersionedMultiLocation, assets: v9122.VersionedMultiAssets, feeAssetItem: number, weightLimit: v9122.V2WeightLimit} {
    assert(this.isV9122)
    return this._chain.decodeCall(this.call)
  }
}

export class XcmPalletLimitedTeleportAssetsCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'XcmPallet.limited_teleport_assets')
    this._chain = ctx._chain
    this.call = call
  }

  /**
   * Teleport some assets from the local chain to some destination chain.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *   `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  get isV9122(): boolean {
    return this._chain.getCallHash('XcmPallet.limited_teleport_assets') === '3c203a3f95b9fe53b8c376802c4fe60fa6077815af7432dcd2a3e458169a5d2a'
  }

  /**
   * Teleport some assets from the local chain to some destination chain.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *   `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  get asV9122(): {dest: v9122.VersionedMultiLocation, beneficiary: v9122.VersionedMultiLocation, assets: v9122.VersionedMultiAssets, feeAssetItem: number, weightLimit: v9122.V2WeightLimit} {
    assert(this.isV9122)
    return this._chain.decodeCall(this.call)
  }
}

export class XcmPalletReserveTransferAssetsCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'XcmPallet.reserve_transfer_assets')
    this._chain = ctx._chain
    this.call = call
  }

  /**
   *  Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   *  a notification XCM.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *    `dest` side.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `ReserveAssetDeposit { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get isV9030(): boolean {
    return this._chain.getCallHash('XcmPallet.reserve_transfer_assets') === '3c069703413ed53ed30061e5da3bc55ab8fa9032fc014ba18afc7afe32930ebd'
  }

  /**
   *  Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   *  a notification XCM.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *    `dest` side.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `ReserveAssetDeposit { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get asV9030(): {dest: v9030.MultiLocation, beneficiary: v9030.MultiLocation, assets: v9030.MultiAsset[], destWeight: bigint} {
    assert(this.isV9030)
    return this._chain.decodeCall(this.call)
  }

  /**
   *  Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   *  a notification XCM.
   * 
   *  Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *    `dest` side.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `ReserveAssetDeposited { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get isV9100(): boolean {
    return this._chain.getCallHash('XcmPallet.reserve_transfer_assets') === 'c4558a18f0400069c14aaa3575bad0bb84b99ac94f206e8ab02890276f174ff4'
  }

  /**
   *  Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   *  a notification XCM.
   * 
   *  Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *    `dest` side.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `ReserveAssetDeposited { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get asV9100(): {dest: v9100.VersionedMultiLocation, beneficiary: v9100.VersionedMultiLocation, assets: v9100.VersionedMultiAssets, feeAssetItem: number, destWeight: bigint} {
    assert(this.isV9100)
    return this._chain.decodeCall(this.call)
  }

  /**
   * Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   * a notification XCM.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   */
  get isV9111(): boolean {
    return this._chain.getCallHash('XcmPallet.reserve_transfer_assets') === '123b8170fa49ede01f38623e457f4e4d417c90cff5b93ced45a9eb8fe8e6ca2e'
  }

  /**
   * Transfer some assets from the local chain to the sovereign account of a destination chain and forward
   * a notification XCM.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   */
  get asV9111(): {dest: v9111.VersionedMultiLocation, beneficiary: v9111.VersionedMultiLocation, assets: v9111.VersionedMultiAssets, feeAssetItem: number} {
    assert(this.isV9111)
    return this._chain.decodeCall(this.call)
  }
}

export class XcmPalletTeleportAssetsCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'XcmPallet.teleport_assets')
    this._chain = ctx._chain
    this.call = call
  }

  /**
   *  Teleport some assets from the local chain to some destination chain.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *    `dest` side.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get isV9010(): boolean {
    return this._chain.getCallHash('XcmPallet.teleport_assets') === '3c069703413ed53ed30061e5da3bc55ab8fa9032fc014ba18afc7afe32930ebd'
  }

  /**
   *  Teleport some assets from the local chain to some destination chain.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *    `dest` side.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get asV9010(): {dest: v9010.MultiLocation, beneficiary: v9010.MultiLocation, assets: v9010.MultiAsset[], destWeight: bigint} {
    assert(this.isV9010)
    return this._chain.decodeCall(this.call)
  }

  /**
   *  Teleport some assets from the local chain to some destination chain.
   * 
   *  Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *    `dest` side. May not be empty.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get isV9100(): boolean {
    return this._chain.getCallHash('XcmPallet.teleport_assets') === 'c4558a18f0400069c14aaa3575bad0bb84b99ac94f206e8ab02890276f174ff4'
  }

  /**
   *  Teleport some assets from the local chain to some destination chain.
   * 
   *  Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *    an `AccountId32` value.
   *  - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *    `dest` side. May not be empty.
   *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *    `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get asV9100(): {dest: v9100.VersionedMultiLocation, beneficiary: v9100.VersionedMultiLocation, assets: v9100.VersionedMultiAssets, feeAssetItem: number, destWeight: bigint} {
    assert(this.isV9100)
    return this._chain.decodeCall(this.call)
  }

  /**
   * Teleport some assets from the local chain to some destination chain.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *   `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get isV9111(): boolean {
    return this._chain.getCallHash('XcmPallet.teleport_assets') === '123b8170fa49ede01f38623e457f4e4d417c90cff5b93ced45a9eb8fe8e6ca2e'
  }

  /**
   * Teleport some assets from the local chain to some destination chain.
   * 
   * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
   * 
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `dest_weight`: Equal to the total weight on `dest` of the XCM message
   *   `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
   */
  get asV9111(): {dest: v9111.VersionedMultiLocation, beneficiary: v9111.VersionedMultiLocation, assets: v9111.VersionedMultiAssets, feeAssetItem: number} {
    assert(this.isV9111)
    return this._chain.decodeCall(this.call)
  }
}
