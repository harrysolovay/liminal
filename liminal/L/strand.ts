import type { Context } from "../Context.ts"
import type { Definition } from "../Definition.ts"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"
import { continuation } from "./continuation.ts"
import { reflect } from "./reflect.ts"

export function* strand<Y extends Rune<any>, T>(
  definition: Definition<Y, T>,
  context?: Context,
): Generator<Rune<LEvent> | Y, T> {
  const strand = new Strand(definition, {
    parent: yield* reflect,
    context,
  })
  return yield* continuation("strand", () => strand.then())
}
