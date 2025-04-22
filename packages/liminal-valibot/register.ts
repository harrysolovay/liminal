import { toJsonSchema } from "@valibot/to-json-schema"
import { register } from "liminal-schema"
import type { json } from "liminal-util"
import type { BaseIssue, BaseSchema } from "valibot"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalValibot]: LiminalValibot
  }
  interface LStatics<_X> {
    [LiminalValibot]: (schema: _X) => _X extends LiminalValibot<infer T> ? T : never
  }
}

export declare const LiminalValibot: unique symbol

export type LiminalValibot<T = any> = BaseSchema<T, json.ValueObject, BaseIssue<any>>

register((type) => {
  if (
    typeof type === "object" && type !== null && (type as any).kind === "schema"
    && typeof (type as any)["~run"] === "function"
  ) {
    return toJsonSchema(type)
  }
  return
})
