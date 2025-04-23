import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { context } from "../state/Context.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { emit } from "./emit.ts"
import { rune } from "./rune.ts"

export function* _infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const state = context.get()
  const modelRegistry = state.getOrInit(ModelRegistry.make)
  const model = modelRegistry.peek()
  const messageRegistry = state.getOrInit(MessageRegistry.make)
  const counter = state.getOrInit(InferenceRequestCounter)
  assert(model)
  const requestId = counter.next()
  yield* emit(new InferenceRequested(requestId, schema))
  const inference = yield* rune(() => model.resolve(messageRegistry.messages, schema))
  yield* emit(new Inferred(requestId, inference))
  return inference
}

function InferenceRequestCounter(count: number = 0) {
  return {
    count,
    next() {
      return this.count++
    },
    clone() {
      return InferenceRequestCounter(this.count)
    },
  }
}
