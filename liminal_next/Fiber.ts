import type { Rune } from "./Rune.ts"
import { type RuneIterator, type Runic, unwrapIterator } from "./Runic.ts"

export interface Fiber<Y = any, T = any> {
  Y: Y
  T: T
  index: number
  runic: Runic
  iterator: RuneIterator
  signal: AbortSignal
  status: FiberStatus<T>
  states: Map<new() => any, any> // weak map?
  resolve(value: T): void
  reject(reason?: unknown): void
}

export type FiberStatus<T> = {
  type: "pending"
  promise: Promise<T>
} | {
  type: "resolved"
  resolution: T
} | {
  type: "rejected"
  rejection: unknown
}

let nextIndex = 0

export function Fiber<Y extends Rune, T>(runic: Runic<Y, T>): Fiber<Y, T> {
  const controller = new AbortController()
  const { promise, resolve, reject } = Promise.withResolvers<T>()
  const iterator = unwrapIterator(runic)

  return {
    index: nextIndex++,
    runic,
    iterator,
    signal: controller.signal,
    status: { type: "pending", promise },
    states: new Map(),
    resolve,
    reject,
  } satisfies Omit<Fiber, "Y" | "T"> as never
}
