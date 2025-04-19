import { type Runic } from "./Runic.ts"

export interface Fiber<Y = any, T = any> {
  Y: Y
  T: T
  index: number
  runic: Runic
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

export function Fiber<X extends Runic>(runic: X): Fiber<Runic.Y<X>, Runic.T<X>> {
  const controller = new AbortController()
  const { promise, resolve, reject } = Promise.withResolvers<Runic.T<X>>()
  return {
    index: nextIndex++,
    runic,
    signal: controller.signal,
    status: { type: "pending", promise },
    states: new Map(),
    resolve,
    reject,
  } satisfies Omit<Fiber, "Y" | "T"> as never
}
