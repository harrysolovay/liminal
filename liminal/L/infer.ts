import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { RequestCounter } from "./_common.ts"
import { event } from "./event.ts"
import { rune } from "./rune.ts"

export { infer_ as infer }

interface infer_ extends Generator<Rune<LEvent>, string> {}

function* infer_(schema?: SchemaObject): infer_ {
  const modelRegistry = ModelRegistryContext.getOrInit()
  const model = modelRegistry.peek()
  assert(model)
  const requestId = RequestCounter.next()
  yield* emit(new InferenceRequested(requestId, schema))
  const messageRegistry = MessageRegistryContext.getOrInit()
  const inference = yield* rune((fiber) =>
    model
      .seal({
        messages: messageRegistry.messages,
        schema,
        signal: fiber.controller.signal,
      })
      .resolve(), "infer")
  yield* emit(new Inferred(requestId, inference))
  return inference
}
Object.defineProperty(infer_, "name", { value: "infer" })
