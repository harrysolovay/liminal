export class LiminalAssertionError extends Error {
  override readonly name = "LiminalAssertionError"
}

export namespace LiminalAssertionError {
  export function assert(expr: unknown, msg = ""): asserts expr {
    if (!expr) {
      throw new LiminalAssertionError(msg)
    }
  }

  export function unimplemented(): never {
    throw new LiminalAssertionError()
  }

  export function unreachable(): never {
    throw new LiminalAssertionError()
  }
}
