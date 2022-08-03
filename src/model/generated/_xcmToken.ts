import assert from "assert"
import * as marshal from "./marshal"

export class XcmToken {
  private _amount!: bigint | undefined | null
  private _token!: string

  constructor(props?: Partial<Omit<XcmToken, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._amount = json.amount == null ? undefined : marshal.bigint.fromJSON(json.amount)
      this._token = marshal.string.fromJSON(json.token)
    }
  }

  get amount(): bigint | undefined | null {
    return this._amount
  }

  set amount(value: bigint | undefined | null) {
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
      amount: this.amount == null ? undefined : marshal.bigint.toJSON(this.amount),
      token: this.token,
    }
  }
}
