import { LiminalAssertionError } from "../LiminalAssertionError.ts"

export function unreachable(): never {
  throw new LiminalAssertionError("Unreachable")
}
