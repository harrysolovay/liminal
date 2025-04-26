import { attachCustomInspect } from "liminal-util"
import { Context } from "./Context.ts"
import { type Handler, HandlerContext } from "./Handler.ts"
import { ToolRegistry, ToolRegistryContext } from "./index.ts"
import { FiberCreated, FiberRejected, FiberResolved, FiberStarted } from "./LEvent.ts"
import { MessageRegistry, MessageRegistryContext } from "./MessageRegistry.ts"
import { ModelRegistry, ModelRegistryContext } from "./ModelRegistry.ts"
import { type Rune, RuneKey } from "./Rune.ts"
import { Runic } from "./Runic.ts"

export interface FiberConfig {
  parent?: Fiber
  signal?: AbortSignal
  context: Context
}

export class Fiber<T = any> {
  static *[Symbol.iterator](): Generator<Rune<never>, Fiber> {
    return yield Object.assign((fiber: Fiber) => fiber, {
      [RuneKey]: true,
      debug: "current_fiber",
    } as never)
  }

  static nextIndex: number = 0
  readonly index: number = Fiber.nextIndex++

  readonly #context: Context
  readonly #runic: Runic<Rune, T>
  readonly #handler: Handler | undefined = HandlerContext.get()
  readonly #configSignal?: AbortSignal

  declare readonly parent?: Fiber

  status: FiberStatus<T> = { type: "untouched" }
  controller: AbortController = new AbortController()

  constructor(runic: Runic<Rune, T>, config: FiberConfig) {
    this.#runic = runic
    const { context, parent, signal } = config
    this.#context = context
    if (parent) this.parent = parent
    if (signal) this.#configSignal = signal
    this.handle(new FiberCreated())
  }

  handle(event: any) {
    this.#handler?.call(this, event)
  }

  resolution(): Promise<T> {
    switch (this.status.type) {
      case "untouched": {
        const { promise, resolve, reject } = Promise.withResolvers<T>()
        this.status = {
          type: "pending",
          self: this.controller.signal,
          promise,
        }
        this.handle(new FiberStarted())
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
            this.status = {
              type: "resolved",
              value,
            }
            this.handle(new FiberResolved(value))
            this.controller.abort()
            resolve(value)
          } catch (exception) {
            this.status = {
              type: "rejected",
              exception,
            }
            this.handle(new FiberRejected(exception))
            this.controller.abort()
            reject(exception)
          }
        })
        return promise
      }
      case "pending": {
        return this.status.promise
      }
      case "resolved": {
        return Promise.resolve(this.status.value)
      }
      case "rejected": {
        return Promise.reject(this.status.exception)
      }
      case "aborted": {
        return Promise.reject(this.status.reason)
      }
    }
  }

  static {
    attachCustomInspect(this, ({ index, parent }) => ({ index, ...parent && { parent } }))
  }
}

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
