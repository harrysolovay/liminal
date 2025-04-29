import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import { LiminalAssertionError } from "../LiminalAssertionError.ts"
import type { Rune } from "../Rune.ts"
import type { SchemaObject } from "../schema/Schema.ts"
import { continuation } from "./continuation.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

export function* infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const { context: { models, messages }, signal } = yield* reflect
  const model = models.peek()
  LiminalAssertionError.assert(model)
  const requestId = crypto.randomUUID()
  yield* emit(new InferenceRequested(requestId, schema))
  const inference = yield* continuation("infer", () => model.seal({ messages, schema, signal }).resolve())
  yield* emit(new Inferred(requestId, inference))
  return inference
}
