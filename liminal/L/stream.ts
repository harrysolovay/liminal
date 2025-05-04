import { InferenceRequested, type LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

/** Creates a readable stream of content from the current model. */
export const stream: Iterable<Rune<LEvent>, ReadableStream<string>> = {
  *[Symbol.iterator]() {
    const { context: { adapters, messages }, signal } = yield* reflect
    const adapter = adapters.ensure()
    const requestId = crypto.randomUUID()
    yield* emit(new InferenceRequested(requestId))
    return yield* continuation("stream", adapter.seal({ messages, signal }).stream)
  },
}
