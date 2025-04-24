import { Context } from "./Context.ts"
import type { Rune } from "./Rune.ts"
import { Runic } from "./Runic.ts"

export interface FiberInfo {
  readonly index: number
  readonly parent?: FiberInfo
}

let nextIndex = 0

export interface Fiber<T = any> {
  parent?: Fiber | undefined
  info: FiberInfo
  resolve(): Promise<T>
}

export function Fiber<T = any>(runic: Runic<Rune, T>, parent?: Fiber): Fiber<T> {
  let index = nextIndex++
  let pending: Promise<T> | undefined
  const context = Context.ensure()
  return {
    parent,
    info: {
      index,
      ...parent && { parent: parent.info },
    },
    resolve,
  }

  function resolve(this: Fiber<T>): Promise<T> {
    if (!pending) {
      const { promise, resolve, reject } = Promise.withResolvers<T>()
      pending = promise
      const iterator = Runic.unwrap(runic)
      let nextArg: unknown
      context.run(async () => {
        try {
          let current = await iterator.next()
          while (!current.done) {
            const rune = current.value
            nextArg = await rune(this)
            current = await iterator.next(nextArg)
          }
          const { value } = current
          resolve(value)
        } catch (error) {
          reject(error)
        }
      })
    }
    return pending
  }
}
