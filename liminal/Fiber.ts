import { attachCustomInspect } from "liminal-util"
import { Context } from "./Context.ts"
import type { Rune } from "./Rune.ts"
import { Runic } from "./Runic.ts"

export type FiberStatus<T> = {
  type: "untouched"
} | {
  type: "pending"
  self: AbortSignal
  promise: Promise<T>
} | {
  type: "aborted"
  reason: unknown
} | {
  type: "resolved"
  value: T
} | {
  type: "rejected"
  exception: unknown
}

export class Fiber<T = any> {
  static nextIndex: number = 0

  declare T: T
  readonly index: number = Fiber.nextIndex++

  #runic: Runic<Rune, T>
  declare readonly parent?: Fiber
  #context: Context = Context.ensure()

  signal: AbortSignal
  either: AbortSignal
  abort: (reason?: any) => void

  status: FiberStatus<T> = { type: "untouched" }

  constructor(runic: Runic<Rune, T>, parent?: Fiber) {
    this.#runic = runic
    if (parent) {
      this.parent = parent
    }
    const controller = new AbortController()
    this.signal = controller.signal
    this.either = AbortSignal.any([
      ...this.parent?.signal ? [this.parent.signal] : [],
      this.signal,
    ])
    this.abort = controller.abort.bind(controller)
  }

  static async join<F extends Array<Fiber>>(fibers: F): Promise<{ [I in keyof F]: F[I]["T"] }> {
    return await Promise.all(fibers.map((fiber) => fiber.resolution())) as never
  }

  resolution(this: Fiber<T>): Promise<T> {
    const { status, abort } = this
    switch (status.type) {
      case "untouched": {
        const { promise, resolve, reject } = Promise.withResolvers<T>()
        this.status = {
          type: "pending",
          self: this.signal,
          promise,
        }
        const iterator = Runic.unwrap(this.#runic)
        let nextArg: unknown
        this.#context.run(async () => {
          try {
            let current = await iterator.next()
            while (!current.done) {
              const rune = current.value
              nextArg = await rune(this)
              current = await iterator.next(nextArg)
            }
            const { value } = current
            abort()
            resolve(value)
          } catch (exception) {
            abort(exception)
            reject(exception)
          }
        })
        return promise
      }
      case "pending": {
        return status.promise
      }
      case "resolved": {
        return Promise.resolve(status.value)
      }
      case "rejected": {
        return Promise.reject(status.exception)
      }
      case "aborted": {
        return Promise.reject(status.reason)
      }
    }
  }

  static {
    attachCustomInspect(this, ({ index, parent }) => ({ index, ...parent && { parent } }))
  }
}
