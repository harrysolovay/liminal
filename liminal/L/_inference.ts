import type { Rune } from "../Rune.ts"
import type { SchemaRoot } from "../schema/SchemaRoot.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { assert } from "../util/assert.ts"
import { state } from "./state.ts"

export function* _inference(schema?: SchemaRoot): Generator<Rune, string> {
  const [modelRegistry, { messages }] = yield* state(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  return yield () => model.resolve(messages, schema)
}
