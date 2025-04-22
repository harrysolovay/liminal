import { Kind, type TSchema } from "@sinclair/typebox"
import { register } from "liminal-schema"

declare module "liminal-schema" {
  interface LTypes {
    [LiminalTypebox]: LiminalTypebox
  }
  interface LStatics<_X> {
    [LiminalTypebox]: (schema: _X) => _X extends LiminalTypebox<infer T> ? T : never
  }
}

export declare const LiminalTypebox: unique symbol

export type LiminalTypebox<T = any> = TSchema & { static: T }

register((type) => {
  if (typeof type === "object" && type !== null && Kind in type) {
    return type
  }
  return
})
