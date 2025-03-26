import { LiminalAssertionError } from "../LiminalAssertionError.js"

export function assert(expr: unknown, msg = ""): asserts expr {
  if (!expr) {
    throw new LiminalAssertionError(msg)
  }
}
