import { attachCustomInspect } from "liminal-util"
import { Context } from "./Context.ts"
import type { Rune } from "./Rune.ts"
import { Runic } from "./Runic.ts"

let nextIndex = 0

export class Fiber<T = any> {
  readonly index = nextIndex++
  declare readonly parent?: Fiber
  context = Context.ensure()
  pending: Promise<T> | undefined
  constructor(readonly runic: Runic<Rune, T>, parent?: Fiber) {
    if (parent) {
      this.parent = parent
    }
  }

  resolve(this: Fiber<T>): Promise<T> {
    if (!this.pending) {
      const { promise, resolve, reject } = Promise.withResolvers<T>()
      this.pending = promise
      const iterator = Runic.unwrap(this.runic)
      let nextArg: unknown
      this.context.run(async () => {
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
    return this.pending
  }

  static {
    attachCustomInspect(this, ({ index, parent }) => ({ index, ...parent && { parent } }))
  }
}
