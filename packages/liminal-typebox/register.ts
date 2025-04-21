import { Kind, type TSchema } from "@sinclair/typebox"
import { register } from "liminal-schema"

declare module "liminal-schema" {
  export interface SchemaAdapterRegistry {
    [TypeboxTag]: LiminalTypebox
  }
}

export declare const TypeboxTag: unique symbol

export type LiminalTypebox = TSchema

register<LiminalTypebox>({
  match: (type) => typeof type === "object" && type !== null && Kind in type,
  toJSON: (type) => type,
})
