import { Fiber } from "../Fiber.ts"
import { type Rune, RuneKey } from "../Rune.ts"

export function* rune<R>(
  source: (fiber: Fiber) => R,
  debug?: string,
): Generator<Rune<never>, Awaited<R>> {
  return yield Object.assign(source, {
    [RuneKey]: true,
    debug,
  }) as never
}
