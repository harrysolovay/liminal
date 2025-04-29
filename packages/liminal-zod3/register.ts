import { LiminalAssertionError, register } from "liminal"
import { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

declare module "liminal" {
  interface LTypes<_T> {
    [LiminalZod3]: ZodType<_T, any, any>
  }
}

export declare const LiminalZod3: unique symbol

register({
  test(type) {
    return type instanceof ZodType
  },
  schema(type) {
    return zodToJsonSchema(type) // TODO
  },
  async validate(type, value) {
    const result = await type.safeParseAsync(value)
    if (result.error) {
      throw new LiminalAssertionError(result.error.issues.map((issue) => issue.message).join("\n"))
    }
    return result.data
  },
})
