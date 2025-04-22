import { register } from "liminal-schema"
import { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalZod3]: LiminalZod3
  }
  interface LStatics<_X> {
    [LiminalZod3]: (schema: _X) => _X extends LiminalZod3<infer T> ? T : never
  }
}

export declare const LiminalZod3: unique symbol
export type LiminalZod3<T = any> = ZodType<T, any, any>

register((type) => {
  if (type instanceof ZodType) {
    return zodToJsonSchema(type)
  }
  return
})
