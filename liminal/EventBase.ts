import { attachCustomInspect } from "liminal-util"

export interface EventBase<B extends symbol = symbol, K extends string = string> {
  readonly brand: B
  readonly type: K
}

export function EventBase<B extends symbol, K extends string>(brand: B, type: K) {
  return class implements EventBase<B, K> {
    static is<T>(this: new(...args: any) => T, value: unknown): value is T {
      return typeof value === "object" && value !== null
        && "brand" in value && value.brand === brand
        && "type" in value && value.type === type
    }

    readonly brand = brand
    readonly type = type

    static {
      attachCustomInspect(this, ({ brand: _0, type: _1, ...rest }) => rest)
    }
  }
}
