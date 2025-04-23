import { inspect, type InspectOptions } from "node:util"

export abstract class EventBase<B extends symbol, K extends string> {
  constructor(readonly brand: B, readonly type: K) {}

  [inspect.custom](depth: number, options: InspectOptions) {
    const { brand: _0, type: _1, ...rest } = this
    return `${this.constructor.name} ` + inspect(rest, { ...options, depth })
  }
}
