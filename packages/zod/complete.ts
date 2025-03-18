import type { TypeLike } from "liminal"
import type { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export function from<T>(type: ZodType<T>): TypeLike<T> {
  return {
    toJSONSchema: () => zodToJsonSchema(type),
    *[Symbol.iterator]() {
      return yield {
        kind: "Complete",
        toJSONSchema: () => this.toJSONSchema(),
      }
    },
  }
}
