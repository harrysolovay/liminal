import { attachCustomInspect } from "liminal-util"

export interface EventBase<B extends symbol = symbol, K extends string = string> {
  readonly brand: B
  readonly type: K
}

export function EventBase<B extends symbol, K extends string>(brand: B, type: K) {
  return class implements EventBase<B, K> {
    readonly brand = brand
    readonly type = type

    static {
      attachCustomInspect(this, ({ brand: _0, type: _1, ...rest }) => rest)
    }
  }
}
