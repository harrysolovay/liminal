import type { Globals } from "./Globals.ts"
import { type FiberCreated, type FiberResolved, type FiberStarted, LEventTag } from "./LEvent.ts"
import type { Rune } from "./Rune.ts"
import { type Runic, unwrap } from "./Runic.ts"
import { DefaultStateMap } from "./state/DefaultStateMap.ts"
import { StateMap } from "./state/StateMap.ts"

export interface Fiber<out Y = any, out T = any> {
  Y: Y
  T: T
  status: FiberStatus<T>
  fiberId: number
  signal: AbortSignal
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

export function Fiber<Y extends Rune, T>(
  globals: Globals,
  runic: Runic<Y, T>,
  state?: StateMap,
): Fiber<Y, T> {
  const controller = new AbortController()
  const fiber = {
    status: { type: "untouched" },
    fiberId: nextFiberId++,
    signal: controller.signal,
    state: state ?? new DefaultStateMap(),
    globals,
    run,
    handler,
  } satisfies Omit<Fiber<Y, T>, "Y" | "T"> as Fiber<Y, T>
  fiber.handler<FiberCreated>({
    [LEventTag]: "fiber_created",
  })
  return fiber

  function handler<E>(this: Fiber<Y, T>, event: E): void {
    globals.handler(event, {
      fiber: this.fiberId,
      timestamp: Date.now(),
    })
  }

  async function run(this: Fiber<Y, T>): Promise<T> {
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
    this.status = {
      type: "pending",
      promise,
    }
    queueMicrotask(async () => {
      const iterator = unwrap(runic)
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
        controller.abort(reason)
        reject(reason)
      }
    })
    return await promise
  }
}
