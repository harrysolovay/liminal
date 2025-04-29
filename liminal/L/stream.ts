import { assert } from "liminal-util"
import { InferenceRequested, type LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { current } from "./current.ts"
import { emit } from "./emit.ts"

export const stream: Iterable<Rune<LEvent>, ReadableStream<string>> = {
  *[Symbol.iterator](): Generator<Rune<LEvent>, ReadableStream<string>> {
    const { config: { context }, signal } = yield* current
    assert(context)
    const { models, messages } = context
    const model = models.peek()
    assert(model)
    const requestId = crypto.randomUUID()
    yield* emit(new InferenceRequested(requestId))
    return yield* continuation("stream", () => model.seal({ messages, signal }).stream())
  },
}
