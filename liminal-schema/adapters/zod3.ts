import type { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import { assertLSchema } from "../assertLSchema.ts"
import type { JSONValue } from "../JSON/JSONValue.ts"
import type { LSchema } from "../LSchema.ts"

export function fromZod3Type<O, I extends JSONValue>(zodType: ZodType<O, any, I>): LSchema<O, I> {
  const schema = zodToJsonSchema(zodType)
  assertLSchema(schema)
  return schema as never
}
