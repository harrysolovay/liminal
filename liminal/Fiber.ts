import type { Globals } from "./Globals.ts"
import { type FiberCreated, type FiberResolved, type FiberStarted, LEventTag } from "./LEvent.ts"
import type { Rune } from "./Rune.ts"
import { type Runic, unwrap } from "./Runic.ts"
import { DefaultStateMap } from "./state/DefaultStateMap.ts"
import { StateMap } from "./state/StateMap.ts"

export interface Fiber<out T = any> {
  T: T
  parent: Fiber<any> | undefined
  status: FiberStatus<T>
  fiberId: number
  state: StateMap
  globals: Globals
  run(this: this): Promise<T>
  handler<E>(event: E): void
}

export type FiberStatus<T> = {
  type: "untouched"
} | {
  type: "pending"
  promise: Promise<T>
} | {
  type: "resolved"
  value: T
} | {
  type: "rejected"
  reason?: unknown
}

export interface FiberInfo {
  fiber: number
  timestamp: number
}

let nextFiberId = 0

export interface FiberConfig<T> {
  parent?: Fiber<any>
  globals: Globals
  runic: Runic<Rune, T>
  state?: StateMap | undefined
  signal?: AbortSignal | undefined
}

export function Fiber<T>(config: FiberConfig<T>): Fiber<T> {
  const fiber = {
    state: config.state ?? new DefaultStateMap(),
    globals: config.globals,
    parent: config.parent,
    status: { type: "untouched" },
    fiberId: nextFiberId++,
    run,
    handler,
  } satisfies Omit<Fiber<T>, "T"> as Fiber<T>
  fiber.handler<FiberCreated>({
    [LEventTag]: "fiber_created",
  })
  return fiber

  function handler<E>(this: Fiber<T>, event: E): void {
    config.globals.handler(event, {
      fiber: this.fiberId,
      timestamp: Date.now(),
    })
  }

  async function run(this: Fiber<T>): Promise<T> {
    if (this.status.type === "pending") {
      return await this.status.promise
    } else if (this.status.type === "resolved") {
      return this.status.value
    } else if (this.status.type === "rejected") {
      throw this.status.reason
    }
    this.handler<FiberStarted>({
      [LEventTag]: "fiber_started",
    })
    const { promise, resolve, reject } = Promise.withResolvers<T>()
    if (config.signal) {
      if (config.signal.aborted) {
        reject(config.signal.reason)
        return await promise
      } else {
        config.signal.addEventListener("abort", () => {
          reject(config.signal?.reason)
        })
      }
    }
    this.status = {
      type: "pending",
      promise,
    }
    queueMicrotask(async () => {
      const iterator = unwrap(config.runic)
      let nextArg: any
      try {
        let current = await iterator.next(nextArg)
        while (!current.done) {
          const rune = current.value
          const nextArg = await rune(this)
          current = await iterator.next(nextArg)
        }
        const { value } = current
        this.handler<FiberResolved>({
          [LEventTag]: "fiber_resolved",
          value,
        })
        resolve(value)
      } catch (reason: unknown) {
        reject(reason)
      }
    })
    return await promise
  }
}
