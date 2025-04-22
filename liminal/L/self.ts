import type { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface self {
  [Symbol.iterator](): Generator<Rune<never>, Fiber>
}

export const self: self = {
  *[Symbol.iterator]() {
    return yield* rune((fiber) => fiber)
  },
}
