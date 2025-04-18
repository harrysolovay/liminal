import type { JSONValue } from "liminal-schema"
import type { LSchema } from "liminal-schema"
import { assert } from "liminal-util"
import type { AppendMessage } from "../runes/AppendMessage.ts"
import type { Infer } from "../runes/Infer.ts"
import { append } from "./append.ts"
import { _infer } from "./infer.ts"

export interface assistant extends Iterable<Infer | AppendMessage, string> {
  <O, I extends JSONValue>(schema: LSchema<O, I>): AsyncIterable<Infer | AppendMessage, O>
}

export const assistant: assistant = Object.assign(
  <O, I extends JSONValue>(schema: LSchema<O, I>) => ({
    async *[Symbol.asyncIterator](): AsyncGenerator<Infer | AppendMessage, O> {
      const inference = yield* _infer(schema)
      yield* append("assistant", inference)
      const input = JSON.parse(inference)
      const result = await schema["~standard"].validate(input)
      assert(!result.issues, JSON.stringify(result.issues))
      return result.value
    },
  }),
  {
    *[Symbol.iterator](): Generator<Infer | AppendMessage, string> {
      const inferred = yield* _infer()
      yield* append("assistant", inferred)
      return inferred
    },
  },
)
