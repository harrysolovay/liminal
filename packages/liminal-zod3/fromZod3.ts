import { type SchemaRoot, validateSchemaRoot } from "liminal"
import { _util } from "liminal"
import type { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export function fromZod3<T>(zodType: ZodType<T, any, _util.JSONValueObject>): SchemaRoot<T> {
  return {
    ...validateSchemaRoot(zodToJsonSchema(zodType)),
    "~standard": zodType["~standard"] as never,
  }
}
