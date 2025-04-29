import { LiminalAssertionError, Schema } from "liminal"
import { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export function compile<T>(type: ZodType<T>): Schema<T> {
  return Schema.compile(type, {
    schema() {
      return zodToJsonSchema(type) // TODO
    },
    async validate(value) {
      const result = await type.safeParseAsync(value)
      if (result.error) {
        throw new LiminalAssertionError(result.error.issues.map((issue) => issue.message).join("\n"))
      }
      return result.data
    },
  })
}
