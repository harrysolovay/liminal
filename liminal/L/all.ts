import type { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface all<A extends Array<any>> extends Generator<Rune<never>, Fiber<A>> {}

export function* all<XA extends Array<Fiber>>(
  ...fibers: XA
): all<{ [I in keyof XA]: XA[I]["T"] }> {
  return (yield* rune((_fiber) => Promise.all(fibers.map((fiber) => fiber.run())))) as never
}
