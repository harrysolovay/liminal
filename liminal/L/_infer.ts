import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { Context } from "../Context.ts"
import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { emit } from "./emit.ts"
import { rune } from "./rune.ts"

export function* _infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const modelRegistry = Context.getOrInit(ModelRegistry.make)
  const model = modelRegistry.peek()
  const messageRegistry = Context.getOrInit(MessageRegistry.make)
  const counter = Context.getOrInit(InferenceRequestCounter)
  assert(model)
  const requestId = counter.next()
  yield* emit(new InferenceRequested(requestId, schema))
  const inference = yield* rune(() => model.resolve(messageRegistry.messages, schema))
  yield* emit(new Inferred(requestId, inference))
  return inference
}

function InferenceRequestCounter(instance?: Counter) {
  return {
    count: instance?.count ?? 0,
    next() {
      return this.count++
    },
    clone() {
      return InferenceRequestCounter(this)
    },
  }
}

interface Counter {
  count: number
  next(): number
}
