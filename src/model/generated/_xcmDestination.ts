import assert from "assert"
import * as marshal from "./marshal"

export class XcmDestination {
  private _paraId!: number
  private _id!: string

  constructor(props?: Partial<Omit<XcmDestination, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._paraId = marshal.int.fromJSON(json.paraId)
      this._id = marshal.string.fromJSON(json.id)
    }
  }

  get paraId(): number {
    assert(this._paraId != null, 'uninitialized access')
    return this._paraId
  }

  set paraId(value: number) {
    this._paraId = value
  }

  get id(): string {
    assert(this._id != null, 'uninitialized access')
    return this._id
  }

  set id(value: string) {
    this._id = value
  }

  toJSON(): object {
    return {
      paraId: this.paraId,
      id: this.id,
    }
  }
}
