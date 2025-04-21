import type { SchemaRoot } from "liminal-schema"
import { assert } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { state } from "./state.ts"

export function* _inference(schema?: SchemaRoot): Generator<Rune<never>, string> {
  const [modelRegistry, { messages }] = yield* state(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  return yield () => model.resolve(messages, schema)
}
