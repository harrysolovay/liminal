import type { StandardSchemaV1 } from "@standard-schema/spec"
import { reduce } from "../Actor/reduce.ts"
import type { Spec } from "../Spec.ts"
import { assert } from "../util/assert.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { Infer } from "./Infer.ts"

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

// Define the action type
export interface InferStream<S extends Spec = Spec> extends ActionBase<"infer_stream", S> {
  type: StandardSchemaV1 | undefined
  progress: InferStreamObjectChunk<any>
}

interface InferStreamObjectChunk<O> {
  (chunk: O): void
}

// Define the event types
export interface InferenceStreamRequestedEvent extends ActionEventBase<"inference_requested"> {}

export interface InferStreamedEvent<V extends JSONValue = JSONValue> extends ActionEventBase<"inferred"> {
  value: V
}

// Define the action function with overloads
export function inferStream(): Generator<
  InferStream<{
    Entry: never
    Event: InferenceStreamRequestedEvent | InferStreamedEvent<string>
  }>,
  string
>

export function inferStream<O extends JSONValue>(
  type: StandardSchemaV1<JSONValue, O>,
  progress: (partial: DeepPartial<O>) => void,
): Generator<
  InferStream<{
    Entry: never
    Event: InferenceStreamRequestedEvent | InferStreamedEvent<O>
  }>,
  O
>

// Main implementation
export function* inferStream<O extends JSONValue>(
  type?: StandardSchemaV1<JSONValue, O>,
  progress?: InferStreamObjectChunk<O>,
): Generator<InferStream, unknown> {
  return yield ActionBase("infer_stream", {
    type,
    progress: progress || (() => {}),
    async reduce(scope) {
      if (!scope.runInferStream) {
        // Fallback to regular infer if streaming isn't supported
        assert(scope.runInfer)
        scope.events.emit({ type: "inference_requested" })
        scope = await reduce(scope.runInfer(this as unknown as Infer, scope), scope)
        scope.events.emit({
          type: "inferred",
          value: scope.result,
        })
        return scope.spread({ next: scope.result })
      }

      scope.events.emit({ type: "inference_requested" })
      scope = await reduce(scope.runInferStream(this, scope, this.progress), scope)
      scope.events.emit({
        type: "inferred",
        value: scope.result,
      })
      return scope.spread({ next: scope.result })
    },
  })
}
