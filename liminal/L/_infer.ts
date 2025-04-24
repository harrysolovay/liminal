import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { Context, ContextHandle } from "../Context.ts"
import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"
import { rune } from "./rune.ts"

export function* _infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const context = Context.ensure()
  const modelRegistry = context.get(ModelRegistryContext)
  assert(modelRegistry)
  const model = modelRegistry.peek()
  assert(model)
  const requestId = context.getOrInit(InferenceRequestCounterContext, () => new InferenceRequestCounter()).next()
  yield* emit(new InferenceRequested(requestId, schema))
  const messageRegistry = context.get(MessageRegistryContext)
  assert(messageRegistry)
  const inference = yield* rune(() => model.resolve(messageRegistry.messages, schema))
  yield* emit(new Inferred(requestId, inference))
  return inference
}

class InferenceRequestCounter {
  count: number = 0
  next(): number {
    return this.count++
  }
}

const InferenceRequestCounterContext: ContextHandle<InferenceRequestCounter> = ContextHandle()
