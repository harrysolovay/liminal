import { inspect, type InspectOptions } from "node:util"

export function attachCustomInspect<T>(
  constructor: new(...args: any[]) => T,
  select: (instance: T) => Record<string, unknown>,
) {
  Object.defineProperties(constructor.prototype, {
    [inspect.custom]: {
      value(depth: number, options: InspectOptions) {
        return `${this.constructor.name} ` + inspect(select(this), { ...options, depth })
      },
    },
  })
}
