import { toJsonSchema } from "@valibot/to-json-schema"
import { JSON } from "liminal-util"
import type { BaseIssue, BaseSchema } from "valibot"
import { assertLSchema } from "../assertLSchema.ts"
import type { LSchema } from "../LSchema.ts"

export function fromValibotSchema<T>(vSchema: BaseSchema<T, JSON.JSONValue, BaseIssue<any>>): LSchema<T> {
  const schema = toJsonSchema(vSchema)
  assertLSchema(schema)
  return schema as never
}
