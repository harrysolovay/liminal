import type { JSONValue } from "liminal-shapes"
import { RuneBase } from "../runes/_RuneBase.ts"
import type { Infer } from "../runes/Infer.ts"
import type { Schema } from "../Schema.ts"
import type { LBase } from "./_LBase.ts"

export interface infer_ extends LBase<Infer, string> {
  <T extends JSONValue>(schema: Schema<T>): LBase<Infer, T>
}

export const infer_: infer_ = Object.assign(
  <T extends JSONValue>(schema: Schema<T>) => ({
    *[Symbol.iterator](): Generator<Infer, T> {
      return yield RuneBase("infer", { schema })
    },
  }),
  {
    *[Symbol.iterator](): Generator<Infer, string> {
      return yield RuneBase("infer", {})
    },
  },
)
