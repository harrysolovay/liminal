import { assert } from "liminal-util"
import { InferenceRequested, type LEvent } from "../LEvent.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import { type Rune } from "../Rune.ts"
import { RequestCounter } from "./_common.ts"
import { event } from "./event.ts"
import { rune } from "./rune.ts"

export interface stream extends Iterable<Rune<LEvent>, ReadableStream<string>> {}

export const stream: stream = {
  *[Symbol.iterator](): Generator<Rune<LEvent>, ReadableStream<string>> {
    const modelRegistry = ModelRegistryContext.get()
    assert(modelRegistry)
    const model = modelRegistry.peek()
    assert(model)
    const requestId = RequestCounter.next()
    yield* emit(new InferenceRequested(requestId))
    const messageRegistry = MessageRegistryContext.get()
    assert(messageRegistry)
    return yield* rune((fiber) =>
      model
        .seal({
          messages: messageRegistry.messages,
          signal: fiber.controller.signal,
        })
        .stream(), "stream")
  },
}
