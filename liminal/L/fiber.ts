import type { Fiber } from "../Fiber.ts"
import { type FiberRune, RuneKey } from "../Rune.ts"

export const fiber: Iterable<FiberRune, Fiber> = {
  *[Symbol.iterator](): Generator<FiberRune, Fiber> {
    return yield {
      [RuneKey]: true,
      kind: "fiber",
    } satisfies Omit<FiberRune, "event"> as never
  },
}
