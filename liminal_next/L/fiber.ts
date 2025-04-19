import type { Fiber } from "../Fiber.ts"
import type { Launch } from "../Rune.ts"
import type { Runic } from "../Runic.ts"

export function* fiber<X extends Runic>(runic: X): Generator<Launch, Fiber<Runic.Y<X>, Runic.T<X>>> {
  return yield { type: "launch", runic }
}
