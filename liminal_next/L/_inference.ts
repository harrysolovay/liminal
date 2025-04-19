import type { LSchema } from "liminal-schema"
import { assert } from "liminal-util"
import { MessageRegistry } from "../MessageRegistry.ts"
import { ModelRegistry } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { awaited } from "./awaited.ts"
import { state } from "./state.ts"

export function* _inference(schema?: LSchema): Generator<Rune, string> {
  const modelRegistry = yield* state(ModelRegistry)
  const model = modelRegistry.peek()
  assert(model)
  const messageRegistry = yield* state(MessageRegistry)
  return yield* awaited(model.resolve(messageRegistry.messages, schema))
}
