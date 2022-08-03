import assert from "assert"
import * as marshal from "./marshal"

export class XcmDestination {
  private _paraId!: number | undefined | null
  private _id!: Uint8Array | undefined | null

  constructor(props?: Partial<Omit<XcmDestination, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._paraId = json.paraId == null ? undefined : marshal.int.fromJSON(json.paraId)
      this._id = json.id == null ? undefined : marshal.bytes.fromJSON(json.id)
    }
  }

  get paraId(): number | undefined | null {
    return this._paraId
  }

  set paraId(value: number | undefined | null) {
    this._paraId = value
  }

  get id(): Uint8Array | undefined | null {
    return this._id
  }

  set id(value: Uint8Array | undefined | null) {
    this._id = value
  }

  toJSON(): object {
    return {
      paraId: this.paraId,
      id: this.id == null ? undefined : marshal.bytes.toJSON(this.id),
    }
  }
}
