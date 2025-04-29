import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"
import { continuation } from "./continuation.ts"

export function join<A extends Array<Strand>>(
  ...strands: A
): Generator<Rune<LEvent>, { [I in keyof A]: A[I]["T"] }> {
  return continuation("join", () => Promise.all(strands.map((strand) => strand.then())) as never)
}
