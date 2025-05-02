import type { Context } from "./Context.ts"
import type { Definition } from "./Definition.ts"

/**
 * `Rune` represents a computational unit within a Strand execution.
 * It is a specialized protocol for expressing different kinds of operations
 * that can be yielded from generator functions to control message state
 * and concurrency within the Liminal runtime.
 * @template E The event type this Rune can handle
 */
export interface Rune<E> {
  [RuneKey]: true
  instruction: RuneInstruction<E>
}

export type RuneInstruction<E> =
  | RuneInstruction.Continue
  | RuneInstruction.Emit<E>
  | RuneInstruction.Reflect
  | RuneInstruction.CreateChild
export namespace RuneInstruction {
  /** Tells the runtime to call this function and and pass the result to the next iteration. */
  export interface Continue {
    kind: "continue"
    debug: string
    f: () => any
  }

  /** Dispatch an event to the registered handler. */
  export interface Emit<E> {
    kind: "emit"
    event: E
  }

  /** Tells the runtime to provide a reference to the current strand */
  export interface Reflect {
    kind: "reflect"
  }

  /** Creates a nested execution context with its own definition. */
  export interface CreateChild {
    kind: "create_child"
    definition: Definition
    context?: Context | undefined
  }
}

export namespace Rune {
  /** Extract the event type from a Rune type. */
  export type E<X extends Rune<any>> = X extends Rune<infer E> ? E : never

  /** Type guard to check if a value is a Rune. */
  export function is(value: unknown): value is Rune<any> {
    return typeof value === "object" && value !== null && RuneKey in value
  }
}

/** Symbol used to identify Rune objects. */
export const RuneKey: unique symbol = Symbol.for("liminal/RuneKey")
export type RuneKey = typeof RuneKey
