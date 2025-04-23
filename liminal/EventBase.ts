import { inspect, type InspectOptions } from "node:util"

export interface EventBase<B extends symbol = symbol, K extends string = string> {
  readonly brand: B
  readonly type: K
}

export function EventBase<B extends symbol, K extends string>(brand: B, type: K) {
  return class implements EventBase<B, K> {
    readonly brand = brand
    readonly type = type
    static {
      Object.defineProperties(this.prototype, {
        [inspect.custom]: {
          value(depth: number, options: InspectOptions) {
            const { brand: _0, type: _1, ...rest } = this
            return `${this.constructor.name} ` + inspect(rest, { ...options, depth })
          },
        },
      })
    }
  }
}
