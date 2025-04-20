import type { LSchema } from "liminal-schema"
import { assert } from "liminal-util"
import { MessageRegistry } from "../states/MessageRegistry.ts"
import { ModelRegistry } from "../states/ModelRegistry.ts"
import { awaited } from "./awaited.ts"
import { event } from "./event.ts"
import { state } from "./state.ts"

export function* _inference(schema?: LSchema) {
  const [modelRegistry, { messages }] = yield* state(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  yield* event("inference_requested", schema && { schema })
  const inference = yield* awaited(model.resolve(messages, schema))
  yield* event("inferred", { inference })
  return inference
}
