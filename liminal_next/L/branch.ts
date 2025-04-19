import { MessageRegistry } from "../MessageRegistry.ts"
import { ModelRegistry } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { normalize, type Runic } from "../Runic.ts"
import { fiber } from "./fiber.ts"
import { join } from "./join.ts"
import { state } from "./state.ts"

export function* branch<X extends Runic>(_runic: X): Generator<Rune, Runic.T<X>> {
  const models = yield* state(ModelRegistry)
  const messages = yield* state(MessageRegistry)
  const branch = yield* fiber(function*() {
    yield* state(ModelRegistry, models)
    yield* state(MessageRegistry, messages)
    // return yield* normalize(runic)
  })
  const [resolved] = yield* join(branch)
  // return resolved
  return null!
}
