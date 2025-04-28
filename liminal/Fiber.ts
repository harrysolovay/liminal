import { attachCustomInspect } from "liminal-util"
import { Context } from "./Context.ts"
import { FiberRejectedError } from "./errors.ts"
import { handlers } from "./L/handlers.ts"
import { FiberStatusChanged } from "./LEvent.ts"
import { type Rune } from "./Rune.ts"
import { Runic } from "./Runic.ts"

export interface FiberConfig {
  parent?: Fiber | undefined
  signal?: AbortSignal | undefined
  context?: Context | undefined
}

export class Fiber<T = any> {
  static nextIndex: number = 0

  readonly #definition: Runic<Rune, T>
  readonly #controller: AbortController = new AbortController()

  readonly signal: AbortSignal = this.#controller.signal
  status: FiberStatus<T> = { type: "untouched" }

  readonly index: number = Fiber.nextIndex++
  readonly depth: number
  declare readonly parent?: Fiber
  readonly context: Context

  constructor(definition: Runic<Rune, T>, config?: FiberConfig) {
    this.depth = (config?.parent?.depth ?? -1) + 1
    this.#definition = definition
    const { parent, signal, context } = config ?? {}
    if (parent) this.parent = parent
    if (signal) {
      this.#attachConfigSignal(signal)
    }
    this.context = context ?? new Context()
    this.#handle(new FiberStatusChanged(this.status))
  }

  #handle(event: any): void {
    this.context
      .getOrInit(handlers)
      .values()
      .forEach((handler) => handler.call(this, event))
  }

  #setStatus(status: FiberStatus<T>): void {
    this.status = status
    this.#handle(new FiberStatusChanged(this.status))
  }

  #setTerminalStatus(status: FiberStatus.Rejected | FiberStatus.Resolved<T>): void {
    this.#setStatus(status)
    this.#controller.abort(this.status)
  }

  #attachConfigSignal(signal: AbortSignal): void {
    if (signal.aborted) {
      this.#setTerminalStatus({
        type: "config_signal_aborted",
        reason: signal.reason,
      })
    }
    const f = () => {
      this.#setTerminalStatus({
        type: "config_signal_aborted",
        reason: signal.reason,
      })
    }
    signal.addEventListener("abort", f, { once: true })
    this.#controller.signal.addEventListener("abort", () => {
      signal.removeEventListener("abort", f)
    }, { once: true })
  }

  resolution(): Promise<T> {
    if (this.status.type !== "untouched") {
      return this.#replay(this.status)
    }
    let resolve: (value: T) => void = undefined!
    let reject: (reason?: unknown) => void = undefined!
    const promise = new Promise<T>((resolve_, reject_) => {
      resolve = resolve_
      reject = reject_
    })
    this.status = {
      type: "pending",
      promise,
      resolve,
      reject,
    }
    this.#handle(new FiberStatusChanged(this.status))
    const iterator = Runic.unwrap(this.#definition)
    let nextArg: unknown
    queueMicrotask(async () => {
      try {
        let current = await iterator.next()
        while (!current.done) {
          const rune = current.value
          switch (rune.kind) {
            case "self": {
              nextArg = this
              break
            }
            case "continuation": {
              nextArg = await rune.f()
              break
            }
            case "event": {
              this.#handle(rune.event)
              nextArg = undefined
              break
            }
            case "state": {
              nextArg = this.context.getOrInit(rune.state)
              break
            }
          }
          switch (this.status.type) {
            case "config_signal_aborted":
            case "continuation_exception_thrown":
            case "handler_exception_thrown": {
              return Promise.reject(new FiberRejectedError(this.status))
            }
          }
          current = await iterator.next(nextArg)
        }
        const { value } = current
        this.#setTerminalStatus({
          type: "resolved",
          value,
        })
        resolve(value)
      } catch (exception) {
        this.#setTerminalStatus({
          type: "continuation_exception_thrown",
          exception,
        })
        reject(exception)
      }
    })
    return promise
  }

  #replay(status: Exclude<FiberStatus<T>, FiberStatus.Untouched>): Promise<T> {
    switch (status.type) {
      case "config_signal_aborted":
      case "continuation_exception_thrown":
      case "handler_exception_thrown": {
        return Promise.reject(new FiberRejectedError(status))
      }
      case "resolved": {
        return Promise.resolve(status.value)
      }
      case "pending": {
        return status.promise
      }
    }
  }

  static {
    attachCustomInspect(this, ({ index, parent }) => ({ index, ...parent && { parent } }))
  }
}

export type FiberStatus<T = any> =
  | FiberStatus.Untouched
  | FiberStatus.Pending<T>
  | FiberStatus.Resolved<T>
  | FiberStatus.Rejected
export namespace FiberStatus {
  export interface Untouched {
    type: "untouched"
  }

  export interface Pending<T> {
    type: "pending"
    promise: Promise<T>
    resolve: (value: T) => void
    reject: (reason?: unknown) => void
  }

  export interface Resolved<T> {
    type: "resolved"
    value: T
  }

  export type Rejected =
    | Rejected.ConfigSignalAborted
    | Rejected.ContinuationExceptionThrown
    | Rejected.HandlerExceptionThrown
  export namespace Rejected {
    export interface ConfigSignalAborted {
      type: "config_signal_aborted"
      reason: unknown
    }
    export interface ContinuationExceptionThrown {
      type: "continuation_exception_thrown"
      exception: unknown
    }
    export interface HandlerExceptionThrown {
      type: "handler_exception_thrown"
      exception: unknown
    }
  }
}
