import { LiminalAssertionError } from "../LiminalAssertionError.ts"

export function assert(expr: unknown, msg = ""): asserts expr {
  if (!expr) {
    throw new LiminalAssertionError(msg)
  }
}
