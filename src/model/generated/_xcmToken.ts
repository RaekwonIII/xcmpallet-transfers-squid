import assert from "assert"
import * as marshal from "./marshal"

export class XcmToken {
  private _amount!: bigint
  private _token!: string

  constructor(props?: Partial<Omit<XcmToken, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._amount = marshal.bigint.fromJSON(json.amount)
      this._token = marshal.string.fromJSON(json.token)
    }
  }

  get amount(): bigint {
    assert(this._amount != null, 'uninitialized access')
    return this._amount
  }

  set amount(value: bigint) {
    this._amount = value
  }

  get token(): string {
    assert(this._token != null, 'uninitialized access')
    return this._token
  }

  set token(value: string) {
    this._token = value
  }

  toJSON(): object {
    return {
      amount: marshal.bigint.toJSON(this.amount),
      token: this.token,
    }
  }
}
