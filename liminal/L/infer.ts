import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { event } from "./event.ts"
import { fiber } from "./fiber.ts"

export function* infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const modelRegistry = ModelRegistryContext.getOrInit()
  const model = modelRegistry.peek()
  assert(model)
  const requestId = crypto.randomUUID()
  yield* event(new InferenceRequested(requestId, schema))
  const messageRegistry = MessageRegistryContext.getOrInit()
  const { signal } = yield* fiber
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
