import { type LType, register } from "liminal-schema"
import { LiminalAssertionError } from "liminal-util"
import { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalZod3]: LiminalZod3
  }
  interface LStatics<_X extends LType> {
    [LiminalZod3]: _X extends LiminalZod3<infer T> ? T : never
  }
}

export declare const LiminalZod3: unique symbol
export type LiminalZod3<T = any> = ZodType<T, any, any>

register({
  test(type) {
    return type instanceof ZodType
  },
  toJSON(type) {
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
