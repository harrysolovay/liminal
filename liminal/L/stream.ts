import { assert } from "liminal-util"
import { Context } from "../Context.ts"
import { InferenceRequested, type LEvent } from "../LEvent.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import { type Rune } from "../Rune.ts"
import { RequestCounter } from "./_common.ts"
import { emit } from "./emit.ts"
import { rune } from "./rune.ts"

export interface stream extends Iterable<Rune<LEvent>, ReadableStream<string>> {}

export const stream: stream = {
  *[Symbol.iterator](): Generator<Rune<LEvent>, ReadableStream<string>> {
    const context = Context.ensure()
    const modelRegistry = context.get(ModelRegistryContext)
    assert(modelRegistry)
    const model = modelRegistry.peek()
    assert(model)
    const requestId = RequestCounter.next()
    yield* emit(new InferenceRequested(requestId))
    const messageRegistry = context.get(MessageRegistryContext)
    assert(messageRegistry)
    return yield* rune((fiber) =>
      model
        .seal({
          messages: messageRegistry.messages,
          signal: fiber.signal,
        })
        .stream(), "stream")
  },
}
