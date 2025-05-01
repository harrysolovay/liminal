import { toJsonSchema } from "@valibot/to-json-schema"
import { LiminalAssertionError, Schema } from "liminal"
import { type BaseIssue, type BaseSchema, parse, ValiError } from "valibot"

export function compile<T>(type: BaseSchema<T, any, BaseIssue<any>>): Schema<T> {
  return Schema.compile(type, {
    schema() {
      return toJsonSchema(type)
    },
    validate(value) {
      try {
        return parse(type, value)
      } catch (exception: unknown) {
        throw new LiminalAssertionError(
          exception instanceof ValiError ? JSON.stringify(exception.issues) : JSON.stringify(exception),
        )
      }
    },
  })
}
