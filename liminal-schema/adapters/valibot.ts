import { toJsonSchema } from "@valibot/to-json-schema"
import { JSON } from "liminal-util"
import type { BaseIssue, BaseSchema } from "valibot"
import { ensureLSchema } from "../ensureLSchema.ts"
import type { LSchema } from "../LSchema.ts"

export function fromValibotSchema<T>(vSchema: BaseSchema<T, JSON.JSONValue, BaseIssue<any>>): LSchema<T> {
  return {
    ...ensureLSchema(toJsonSchema(vSchema)),
    "~standard": vSchema["~standard"] as never,
  }
}
