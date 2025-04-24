import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { AgentContext } from "../AgentContext.ts"
import { InferenceRequested, Inferred, type LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"
import { rune } from "./rune.ts"

export function* _infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const { models } = AgentContext.get()
  const model = models.peek()
  assert(model)
  const { messages, getLocal } = AgentContext.get()
  const requestId = getLocal(InferenceRequestCounter).next()
  yield* emit(new InferenceRequested(requestId, schema))
  const inference = yield* rune(() => model.resolve(messages.messages, schema))
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
