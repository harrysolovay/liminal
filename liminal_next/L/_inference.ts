import type { LSchema } from "liminal-schema"
import { assert } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { awaited } from "./awaited.ts"
import { states } from "./states.ts"

export function* _inference(schema?: LSchema): Generator<Rune, string> {
  const [modelRegistry, { messages }] = yield* states(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  return yield* awaited(model.resolve(messages, schema))
}
