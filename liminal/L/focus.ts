import type { Adapter } from "../Adapter.ts"
import type { LEvent } from "../LEvent.ts"
import { AdapterFocused } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

/**
 * Registers a model in the current context and emits a model registration event.
 * Returns the registered model instance.
 */
export function* focus(adapter: Adapter): Generator<Rune<LEvent>, Adapter> {
  const { context: { adapters } } = yield* reflect
  adapters.register(adapter)
  yield* emit(new AdapterFocused(adapter))
  return adapter
}
