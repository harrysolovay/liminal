import { register } from "liminal-schema"
import type { json } from "liminal-util"
import { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

declare module "liminal-schema" {
  export interface SchemaAdapterRegistry {
    [Zod3Tag]: LiminalZod3
  }
}

export declare const Zod3Tag: unique symbol

export type LiminalZod3 = ZodType<any, any, json.ValueObject>

register<LiminalZod3>({
  match: (type) => type instanceof ZodType,
  toJSON: (type) => zodToJsonSchema(type),
})
