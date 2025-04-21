import type { SchemaRoot } from "liminal-schema"
import { assert } from "liminal-util"
import { type InferenceRequested, type LEvent, LEventTag } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { emit } from "./emit.ts"
import { rune } from "./rune.ts"
import { state } from "./state.ts"

export function* _infer(schema?: SchemaRoot): Generator<Rune<LEvent>, string> {
  const [modelRegistry, { messages }] = yield* state(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  yield* emit<InferenceRequested>({
    [LEventTag]: "inference_requested",
    ...schema && { schema },
  })
  return yield* rune(() => model.resolve(messages, schema))
}
