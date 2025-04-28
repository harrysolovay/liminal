import { assert } from "liminal-util"
import { InferenceRequested, type LEvent } from "../LEvent.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import { type Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { event } from "./event.ts"
import { fiber } from "./fiber.ts"

export const stream: Iterable<Rune<LEvent>, ReadableStream<string>> = {
  *[Symbol.iterator](): Generator<Rune<LEvent>, ReadableStream<string>> {
    const modelRegistry = ModelRegistryContext.get()
    assert(modelRegistry)
    const model = modelRegistry.peek()
    assert(model)
    const requestId = crypto.randomUUID()
    yield* event(new InferenceRequested(requestId))
    const messageRegistry = MessageRegistryContext.get()
    assert(messageRegistry)
    const { signal } = yield* fiber
    return yield* continuation(() =>
      model
        .seal({
          messages: messageRegistry.messages,
          signal,
        })
        .stream(), "stream")
  },
}
