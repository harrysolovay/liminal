import type { SchemaObject } from "liminal-schema"
import { assert } from "liminal-util"
import { type InferenceRequested, type Inferred, type LEvent, LEventTag } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Counter } from "../state/Counter.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { emit } from "./emit.ts"
import { rune } from "./rune.ts"
import { state } from "./state.ts"

export function* _infer(schema?: SchemaObject): Generator<Rune<LEvent>, string> {
  const [modelRegistry, { messages }, counter] = yield* state(
    ModelRegistry,
    MessageRegistry,
    InferenceRequestCounter,
  )
  const model = modelRegistry.peek()
  assert(model)
  const requestId = counter.next()
  yield* emit<InferenceRequested>({
    [LEventTag]: true,
    type: "inference_requested",
    ...schema && { schema },
    requestId,
  })
  const inference = yield* rune(() => model.resolve(messages, schema))
  yield* emit<Inferred>({
    [LEventTag]: true,
    type: "inferred",
    inference,
    requestId,
  })
  return inference
}

class InferenceRequestCounter extends Counter {}
