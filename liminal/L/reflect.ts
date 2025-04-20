import type { Fiber } from "../Fiber.ts"
import type { ReflectRune } from "../Rune.ts"

export interface reflect extends Iterable<ReflectRune, Fiber> {}

export const reflect: reflect = {
  *[Symbol.iterator]() {
    return yield { type: "reflect" }
  },
}
