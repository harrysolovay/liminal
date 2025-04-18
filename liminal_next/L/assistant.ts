import type { JSONValue } from "liminal-shapes"
import type { AppendMessage } from "../runes/AppendMessage.ts"
import type { Infer } from "../runes/Infer.ts"
import type { Schema } from "../Schema.ts"
import { _append } from "./_append.ts"
import type { LBase } from "./_LBase.ts"
import { infer_ } from "./infer.ts"

export interface assistant extends LBase<Infer | AppendMessage, string> {
  <T extends JSONValue>(schema: Schema<T>): LBase<Infer | AppendMessage, T>
}

export const assistant: assistant = Object.assign(
  <T extends JSONValue>(schema: Schema<T>) => ({
    *[Symbol.iterator](): Generator<Infer | AppendMessage, T> {
      const inference = yield* infer_(schema)
      yield* _append("assistant", JSON.stringify(inference, null, 2))
      return inference
    },
  }),
  {
    *[Symbol.iterator](): Generator<Infer | AppendMessage, string> {
      const inferred = yield* infer_
      yield* _append("assistant", inferred)
      return inferred
    },
  },
)
