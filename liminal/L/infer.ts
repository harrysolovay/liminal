import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { event } from "./event.ts"
import { messages } from "./messages.ts"
import { models } from "./models.ts"
import { self } from "./self.ts"

export function* infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const modelRegistry = yield* models
  const model = modelRegistry.peek()
  assert(model)
  const requestId = crypto.randomUUID()
  yield* event(new InferenceRequested(requestId, schema))
  const messageRegistry = yield* messages
  const { signal } = yield* self
  const inference = yield* continuation(() =>
    model
      .seal({
        messages: messageRegistry.messages,
        schema,
        signal,
      })
      .resolve(), "infer")
  yield* event(new Inferred(requestId, inference))
  return inference
}
