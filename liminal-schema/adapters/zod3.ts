import { JSON } from "liminal-util"
import type { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import { assertLSchema } from "../assertLSchema.ts"
import type { LSchema } from "../LSchema.ts"

export function fromZod3Type<T>(zodType: ZodType<T, any, JSON.JSONValue>): LSchema<T> {
  const schema = zodToJsonSchema(zodType)
  assertLSchema(schema)
  return schema as never
}
