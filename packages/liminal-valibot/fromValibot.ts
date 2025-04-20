import { toJsonSchema } from "@valibot/to-json-schema"
import { type SchemaRoot, validateSchemaRoot } from "liminal"
import { _util } from "liminal"
import type { BaseIssue, BaseSchema } from "valibot"

export function fromValibot<T>(vSchema: BaseSchema<T, _util.JSONValueObject, BaseIssue<any>>): SchemaRoot<T> {
  return {
    ...validateSchemaRoot(toJsonSchema(vSchema)),
    "~standard": vSchema["~standard"] as never,
  }
}
