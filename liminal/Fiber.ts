import { assert } from "liminal-util"
import type { Globals } from "./Globals.ts"
import { FiberCreated, FiberResolved, FiberStarted } from "./LEvent.ts"
import type { Rune } from "./Rune.ts"
import { Runic } from "./Runic.ts"
import type { StateMap } from "./state/StateMap.ts"

export interface Fiber<out T = any> {
  T: T
  runic: Runic<Rune, T>
  globals: Globals
  parent: Fiber<any> | undefined
  fiberId: number
  handler<E>(event: E): void
  run(): Promise<T>
}

export interface FiberInfo {
  fiber: number
  timestamp: number
}

let nextFiberId = 0

export interface FiberConfig<T = any> {
  T: T
  signal?: AbortSignal | undefined
  globals: Globals
  state?: StateMap | undefined
}

export function handler<E>(fiberConfig: FiberConfig, event: E): void {
  fiberConfig.globals.handler(event, {
    // fiber: fiberConfig.fiberId,
    timestamp: Date.now(),
  })
}

// export interface FiberConfig<T> {
//   parent?: Fiber<any>
//   globals: Globals
//   runic: Runic<Rune, T>
//   signal?: AbortSignal | undefined
// }

// export function Fiber<T>(config: FiberConfig<T>): Fiber<T> {
//   const fiber = {
//     runic: config.runic,
//     globals: config.globals,
//     parent: config.parent,
//     fiberId: nextFiberId++,
//     handler,
//     run,
//   } satisfies Omit<Fiber<T>, "T"> as Fiber<T>

//   fiber.handler(new FiberCreated())
//   return fiber

//   async function run(this: Fiber<T>): Promise<T> {
//     fiber.handler(new FiberStarted())
//     const iterator = Runic.unwrap(this.runic)
//     const result = await iterator.next()
//     assert(result.done)
//     fiber.handler(new FiberResolved(result.value))
//     return result.value
//   }
// }
