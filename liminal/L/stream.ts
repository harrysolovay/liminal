import { assert } from "liminal-util"
import { InferenceRequested, type LEvent } from "../LEvent.ts"
import { type Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { event } from "./event.ts"
import { messages } from "./messages.ts"
import { models } from "./models.ts"
import { self } from "./self.ts"

export const stream: Iterable<Rune<LEvent>, ReadableStream<string>> = {
  *[Symbol.iterator](): Generator<Rune<LEvent>, ReadableStream<string>> {
    const modelRegistry = yield* models
    assert(modelRegistry)
    const model = modelRegistry.peek()
    assert(model)
    const requestId = crypto.randomUUID()
    yield* event(new InferenceRequested(requestId))
    const messageRegistry = yield* messages
    assert(messageRegistry)
    const { signal } = yield* self
    return yield* continuation(() =>
      model
        .seal({
          messages: messageRegistry.messages,
          signal,
        })
        .stream(), "stream")
  },
}
