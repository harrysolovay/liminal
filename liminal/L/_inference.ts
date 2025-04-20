import type { LSchema } from "liminal-schema"
import { assert } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { state } from "./state.ts"

export function* _inference(schema?: LSchema): Generator<Rune, string> {
  const [modelRegistry, { messages }] = yield* state(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  return yield () => model.resolve(messages, schema)
}
