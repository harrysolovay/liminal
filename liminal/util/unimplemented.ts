import { LiminalAssertionError } from "../LiminalAssertionError.js"

export function unimplemented(): never {
  throw new LiminalAssertionError("Unimplemented")
}
