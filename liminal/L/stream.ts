import { InferenceRequested, type LEvent } from "../LEvent.ts"
import { LiminalAssertionError } from "../LiminalAssertionError.ts"
import type { Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

export const stream: Iterable<Rune<LEvent>, ReadableStream<string>> = {
  *[Symbol.iterator]() {
    const { context: { models, messages }, signal } = yield* reflect
    const model = models.peek()
    LiminalAssertionError.assert(model)
    const requestId = crypto.randomUUID()
    yield* emit(new InferenceRequested(requestId))
    return yield* continuation("stream", () => model.seal({ messages, signal }).stream())
  },
}
