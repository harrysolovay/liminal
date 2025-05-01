import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import { LiminalAssertionError } from "../LiminalAssertionError.ts"
import type { Rune } from "../Rune.ts"
import { Schema } from "../Schema.ts"
import { continuation } from "./continuation.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

export function* infer(schema?: Schema): Generator<Rune<LEvent>, string> {
  const { context: { models, messages }, signal } = yield* reflect
  const model = models.peek()
  LiminalAssertionError.assert(model)
  const requestId = crypto.randomUUID()
  yield* emit(new InferenceRequested(requestId, schema))
  let inference = yield* continuation("infer", () =>
    model.seal({
      messages,
      ...schema && {
        schema: schema.type === "object"
          ? schema
          : Schema.wrap(schema),
      },
      signal,
    }).resolve())
  if (schema?.type && schema.type !== "object") {
    inference = JSON.stringify(JSON.parse(inference).value)
  }
  yield* emit(new Inferred(requestId, inference))
  return inference
}
