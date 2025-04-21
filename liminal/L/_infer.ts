import type { SchemaRoot } from "liminal-schema"
import { assert } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { rune } from "./rune.ts"
import { state } from "./state.ts"

export function* _infer(schema?: SchemaRoot): Generator<Rune<never>, string> {
  const [modelRegistry, { messages }] = yield* state(ModelRegistry, MessageRegistry)
  const model = modelRegistry.peek()
  assert(model)
  return yield* rune(() => model.resolve(messages, schema))
}
