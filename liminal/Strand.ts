import { attachCustomInspect } from "liminal-util"
import { Context } from "./Context.ts"
import { Definition } from "./Definition.ts"
import { StrandRejectedError } from "./errors.ts"
import { continuation } from "./L/continuation.ts"
import { StrandStatusChanged } from "./LEvent.ts"
import type { Rune } from "./Rune.ts"

export interface StrandConfig {
  parent?: Strand | undefined
  context?: Context | undefined
}

let nextIndex: number = 0

export class Strand<Y extends Rune<any> = Rune<any>, T = any> implements Iterable<Y, T>, PromiseLike<T> {
  declare T: T
  declare Y: Y

  readonly #controller: AbortController = new AbortController()
  readonly signal: AbortSignal = this.#controller.signal
  #handle?: ((this: Strand, event: any) => void) | undefined
  #definition: Definition<Y, T>
  status: StrandStatus<T> = { type: "untouched" }
  readonly index: number = nextIndex++
  readonly depth: number
  declare readonly parent?: Strand
  readonly context: Context

  constructor(definition: Definition<Y, T>, config: StrandConfig) {
    this.#definition = definition
    this.depth = (config?.parent?.depth ?? -1) + 1
    const { parent, context } = config ?? {}
    if (parent) {
      this.parent = parent
      this.#attachSignal(parent.signal, () => ({
        type: "parent_aborted",
        reason: parent.signal.reason,
      }))
    }
    if (context) {
      this.context = context
      const { signal, handler } = context
      if (signal) {
        this.#attachSignal(signal, () => ({
          type: "config_signal_aborted",
          reason: signal.reason,
        }))
      }
      if (handler) {
        this.#handle = (function(this: Strand, event: any) {
          try {
            handler.call(this, event)
          } catch (exception) {
            this.#setTerminalStatus({
              type: "handler_exception_thrown",
              exception,
            })
          }
        }).bind(this)
        this.#handle(new StrandStatusChanged(this.status))
      }
    } else {
      this.context = new Context()
    }
  }

  #setStatus(status: StrandStatus<T>): void {
    this.status = status
    this.#handle?.(new StrandStatusChanged(this.status))
  }

  #setTerminalStatus = (status: StrandStatus.Rejected | StrandStatus.Resolved<T>): void => {
    this.#setStatus(status)
    this.#controller.abort(this.status)
  }

  #attachSignal(
    signal: AbortSignal,
    getStatus: () => StrandStatus.Rejected.ConfigSignalAborted | StrandStatus.Rejected.ParentAborted,
  ): void {
    const f = () => {
      this.#setTerminalStatus(getStatus())
    }
    if (signal.aborted) {
      return f()
    }
    signal.addEventListener("abort", f, { once: true })
    this.#controller.signal.addEventListener(
      "abort",
      () => {
        signal.removeEventListener("abort", f)
      },
      { once: true },
    )
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): PromiseLike<TResult1 | TResult2> {
    if (this.status.type !== "untouched") {
      return this.#replay(this.status).then(onfulfilled, onrejected)
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
    this.#handle?.(new StrandStatusChanged(this.status))
    const iterator = Definition.unwrap(this.#definition)
    let nextArg: unknown
    queueMicrotask(async () => {
      try {
        let current = await iterator.next()
        while (!current.done) {
          const rune = current.value
          const { value } = rune
          switch (value.kind) {
            case "reflect": {
              nextArg = this
              break
            }
            case "continuation": {
              nextArg = await value.f()
              break
            }
            case "event": {
              this.#handle?.(value.event)
              nextArg = undefined
              break
            }
          }
          switch (this.status.type) {
            case "config_signal_aborted":
            case "parent_aborted":
            case "continuation_exception_thrown":
            case "handler_exception_thrown": {
              try {
                await iterator.return?.(undefined)
              } catch (exception) {}
              return Promise.reject(new StrandRejectedError(this.status))
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
    return promise.then(onfulfilled, onrejected)
  }

  *[Symbol.iterator](): Generator<Y, T> {
    return yield* continuation("run_strand", () => this.then()) as any
  }

  #replay(status: Exclude<StrandStatus, StrandStatus.Untouched>): Promise<T> {
    switch (status.type) {
      case "config_signal_aborted":
      case "parent_aborted":
      case "continuation_exception_thrown":
      case "handler_exception_thrown": {
        return Promise.reject(new StrandRejectedError(status))
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

export type StrandStatus<T = any> =
  | StrandStatus.Untouched
  | StrandStatus.Pending<T>
  | StrandStatus.Resolved<T>
  | StrandStatus.Rejected
export namespace StrandStatus {
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
    | Rejected.ParentAborted
    | Rejected.ContinuationExceptionThrown
    | Rejected.HandlerExceptionThrown
  // | Rejected.ModelError
  // | Rejected.ValidationError
  // | Rejected.Timeout
  export namespace Rejected {
    export interface ConfigSignalAborted {
      type: "config_signal_aborted"
      reason: unknown
    }
    export interface ParentAborted {
      type: "parent_aborted"
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
