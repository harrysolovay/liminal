import { register } from "liminal-schema"
import { LiminalAssertionError } from "liminal-util"
import { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

declare module "liminal-schema" {
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
    return zodToJsonSchema(type)
  },
  async validate(type, value) {
    const result = await type.safeParseAsync(value)
    if (result.error) {
      throw new LiminalAssertionError(result.error.issues.map((issue) => issue.message).join("\n"))
    }
    return result.data
  },
})
