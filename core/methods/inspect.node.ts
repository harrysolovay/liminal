import type { AnyType } from "../Type.ts"

export const inspect = {
  [Symbol.for("nodejs.util.inspect.custom")](
    this: AnyType,
    _0: unknown,
    _1: unknown,
    _inspect_: (value: unknown) => string,
  ): string {
    return this.display()
  },
}
