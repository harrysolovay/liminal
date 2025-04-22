import { toJsonSchema } from "@valibot/to-json-schema"
import { register } from "liminal-schema"
import { LiminalAssertionError } from "liminal-util"
import type { BaseIssue, BaseSchema } from "valibot"

declare module "liminal-schema" {
  interface LTypes<_T> {
    [LiminalValibot]: BaseSchema<_T, any, BaseIssue<any>>
  }
}

export declare const LiminalValibot: unique symbol

register({
  test(type) {
    return (
      typeof type === "object" && type !== null && (type as any).kind === "schema"
      && typeof (type as any)["~run"] === "function"
    )
  },
  schema(type) {
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
