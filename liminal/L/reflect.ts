import type { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"

export interface reflect extends Iterable<Rune, Fiber> {}

export const reflect: reflect = {
  *[Symbol.iterator]() {
    return yield (fiber) => fiber
  },
}
