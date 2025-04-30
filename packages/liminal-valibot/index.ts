import { toJsonSchema } from "@valibot/to-json-schema"
import { LiminalAssertionError, Schema } from "liminal"
import type { BaseIssue, BaseSchema } from "valibot"

export function compile<T>(type: BaseSchema<T, any, BaseIssue<any>>): Schema<T> {
  return Schema.compile(type, {
    schema() {
      return toJsonSchema(type)
    },
    async validate(value) {
      const result = await type["~standard"].validate(value)
      if (result.issues) {
        throw new LiminalAssertionError(result.issues.map((issue) => issue.message).join("\n"))
      } else {
        return result.value
      }
    },
  })
}
