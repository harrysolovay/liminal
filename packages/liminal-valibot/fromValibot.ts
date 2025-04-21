import { toJsonSchema } from "@valibot/to-json-schema"
import { type SchemaRoot, validateSchemaRoot } from "liminal-schema"
import { JSON } from "liminal-util"
import type { BaseIssue, BaseSchema } from "valibot"

export function fromValibot<T>(vSchema: BaseSchema<T, JSON.ValueObject, BaseIssue<any>>): SchemaRoot<T> {
  return {
    ...validateSchemaRoot(toJsonSchema(vSchema)),
    "~standard": vSchema["~standard"] as never,
  }
}
