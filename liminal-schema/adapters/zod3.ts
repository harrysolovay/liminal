import { JSON } from "liminal-util"
import type { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import { ensureLSchema } from "../ensureLSchema.ts"
import type { LSchema } from "../LSchema.ts"

export function fromZod3Type<T>(zodType: ZodType<T, any, JSON.JSONValue>): LSchema<T> {
  return {
    ...ensureLSchema(zodToJsonSchema(zodType)),
    "~standard": zodType["~standard"] as never,
  }
}
