import type { LSchema } from "liminal-schema"
import { assert } from "liminal-util"
import type { AwaitRune, StateRune } from "../Rune.ts"
import { MessageRegistry } from "../states/MessageRegistry.ts"
import { ModelRegistry } from "../states/ModelRegistry.ts"
import { awaited } from "./awaited.ts"
import { state } from "./state.ts"

export function* _inference(schema?: LSchema): Generator<AwaitRune | StateRune, string> {
  const [modelRegistry, { messages }] = yield* state(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  return yield* awaited(model.resolve(messages, schema))
}
