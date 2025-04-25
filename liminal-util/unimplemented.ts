import { LiminalAssertionError } from "./LiminalAssertionError.ts"

export function unimplemented(): never {
  throw new LiminalAssertionError()
}
