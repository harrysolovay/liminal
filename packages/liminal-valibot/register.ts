import { toJsonSchema } from "@valibot/to-json-schema"
import { type LType, register } from "liminal-schema"
import { LiminalAssertionError } from "liminal-util"
import type { BaseIssue, BaseSchema } from "valibot"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalValibot]: LiminalValibot
  }
  interface LStatics<_X extends LType> {
    [LiminalValibot]: _X extends LiminalValibot<infer T> ? T : never
  }
}

export declare const LiminalValibot: unique symbol

export type LiminalValibot<T = any> = BaseSchema<T, any, BaseIssue<any>>

register({
  test(type) {
    return (
      typeof type === "object" && type !== null && (type as any).kind === "schema"
      && typeof (type as any)["~run"] === "function"
    )
  },
  toJSON(type) {
    return toJsonSchema(type)
  },
  async validate(type, value) {
    const result = await type["~standard"].validate(value)
    if (result.issues) {
      throw new LiminalAssertionError(result.issues.map((issue) => issue.message).join("\n"))
    } else {
      return result.value
    }
  },
})
