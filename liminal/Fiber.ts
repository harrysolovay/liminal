import type { Globals } from "./Globals.ts"
import type { Rune } from "./Rune.ts"
import { type RuneIterator, type Runic, unwrap } from "./Runic.ts"
import { StateMap } from "./StateMap.ts"

export interface Fiber<Y = any, T = any> {
  Y: Y
  T: T
  index: number
  iterator: RuneIterator
  signal: AbortSignal
  state: StateMap
  globals: Globals
  promise: Promise<T>
  resolve: (value?: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

let nextIndex = 0

export function Fiber<Y extends Rune, T>(
  globals: Globals,
  runic: Runic<Y, T>,
  state: StateMap = new StateMap(),
): Fiber<Y, T> {
  const controller = new AbortController()
  const iterator = unwrap(runic)
  const resolvers = Promise.withResolvers<T>()
  const fiber: Fiber<Y, T> = {
    index: nextIndex++,
    iterator,
    signal: controller.signal,
    state,
    globals,
    ...resolvers,
  } satisfies Omit<Fiber<Y, T>, "Y" | "T"> as never
  queueMicrotask(async () => {
    let nextArg: any
    try {
      let current = await iterator.next(nextArg)
      while (!current.done) {
        const { value } = current
        const nextArg = await value(fiber)
        current = await iterator.next(nextArg)
      }
      resolvers.resolve(current.value)
    } catch (reason: unknown) {
      controller.abort(reason)
      resolvers.reject(reason)
    }
  })
  return fiber
}
