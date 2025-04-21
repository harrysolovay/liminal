import { type SchemaRoot, validateSchemaRoot } from "liminal-schema"
import { JSON } from "liminal-util"
import type { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export function fromZod3<T>(zodType: ZodType<T, any, JSON.ValueObject>): SchemaRoot<T> {
  return validateSchemaRoot(zodToJsonSchema(zodType))
}
