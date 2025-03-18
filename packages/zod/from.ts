import type { TypeLike } from "liminal"
import { ZodString, type ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export function from<T>(type: ZodType<T>): TypeLike<T> {
  return {
    toJSONSchema: () =>
      zodToJsonSchema(type, {
        strictUnions: true,
        $refStrategy: "root",
      }),
    *[Symbol.iterator]() {
      return yield {
        kind: "Complete",
        typeLike: this,
      }
    },
    isString: type instanceof ZodString,
  }
}
