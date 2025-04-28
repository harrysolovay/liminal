import type { Fiber } from "../Fiber.ts"
import { RuneKey, type SelfRune } from "../Rune.ts"

export const self: Iterable<SelfRune, Fiber> = {
  *[Symbol.iterator](): Generator<SelfRune, Fiber> {
    return yield {
      [RuneKey]: true,
      kind: "self",
    } satisfies Omit<SelfRune, "event"> as never
  },
}
