import type { Rune } from "./Rune.ts"
import { type RuneIterator, type Runic, unwrapIterator } from "./Runic.ts"
import { Scheduler } from "./Scheduler.ts"
import { StateMap } from "./StateMap.ts"

export interface Fiber<Y = any, T = any> {
  Y: Y
  T: T
  index: number
  runic: Runic
  iterator: RuneIterator
  signal: AbortSignal
  promise: Promise<T>
  status?: FiberStatus<T>
  state: StateMap
  resolve(value: T): void
  reject(reason?: unknown): void
  step(nextArg: any): void
}

export type FiberStatus<T> = {
  type: "resolved"
  value: T
} | {
  type: "rejected"
  reason: unknown
}

let nextIndex = 0

export function Fiber<Y extends Rune, T>(runic: Runic<Y, T>, state: StateMap = new StateMap()): Fiber<Y, T> {
  const controller = new AbortController()
  const { promise, resolve, reject } = Promise.withResolvers<T>()
  const iterator = unwrapIterator(runic)

  return {
    index: nextIndex++,
    runic,
    iterator,
    signal: controller.signal,
    promise,
    state,
    resolve(value) {
      this.status = {
        type: "resolved",
        value,
      }
      resolve(value)
    },
    reject(reason) {
      this.status = {
        type: "rejected",
        reason,
      }
      reject(reason)
    },
    step,
  } satisfies Omit<Fiber<Y, T>, "Y" | "T"> as never
}

async function step(this: Fiber, nextArg: any) {
  try {
    const { iterator } = this
    const next = await iterator.next(nextArg)
    if (next.done) {
      this.resolve(next.value)
      return
    }
    const rune = next.value
    switch (rune.type) {
      case "fork": {
        const child = Fiber(rune.runic, rune.state)
        Scheduler.enqueue(() => {
          child.step(child)
        })
        break
      }
      case "await": {
        const resolved = await rune.value
        Scheduler.enqueue(() => void this.step(resolved))
        break
      }
      case "emit": {
        break
      }
      case "join": {
        try {
          const results = await Promise.all(rune.fibers.map(async ({ promise }) => promise))
          Scheduler.enqueue(() => {
            this.step(results)
          })
          break
        } catch (reason: unknown) {
          this.reject(reason)
          break
        }
      }
      case "state": {
        Scheduler.enqueue(() => {
          this.step(rune.constructors.map((constructor) => {
            let instance = this.state.get(constructor)
            if (!instance) {
              instance = new constructor()
              this.state.set(constructor, instance)
            }
            return instance
          }))
        })
        break
      }
    }
  } catch (reason: unknown) {
    this.reject(reason)
  }
}
