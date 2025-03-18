import type { Type } from "arktype"
import type { TypeLike } from "liminal"

export function from<T>(type: Type<T>): TypeLike<T> {
  return {
    toJSONSchema: () => type.toJsonSchema(),
    *[Symbol.iterator]() {
      return yield {
        kind: "Complete",
        toJSONSchema: () => this.toJSONSchema(),
      }
    },
  }
}
