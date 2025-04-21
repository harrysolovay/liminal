import { register } from "liminal-schema"
import type { json } from "liminal-util"
import type { BaseIssue, BaseSchema } from "valibot"

declare module "liminal-schema" {
  export interface SchemaAdapterRegistry {
    [ValibotTag]: LiminalValibot
  }
}

export declare const ValibotTag: unique symbol

export type LiminalValibot = BaseSchema<any, json.ValueObject, BaseIssue<any>>

register<LiminalValibot>({
  match,
  toJSON: (type) => type,
})

function match(x: unknown): x is BaseSchema<any, any, any> {
  return (typeof x === "object" && x !== null && (x as any).kind === "schema"
    && typeof (x as any)["~run"] === "function")
}
