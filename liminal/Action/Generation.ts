import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { JSONValue } from "../util/JSONValue.js"

export function Generation(): Generator<Generation, string>
export function Generation<O>(type: StandardSchemaV1<unknown, O>): Generator<Generation, O>
export function* Generation(type?: StandardSchemaV1): Generator<Generation, unknown> {
  return yield ActionBase("Generation", { type })
}

export interface Generation extends ActionBase<"Generation"> {
  type: StandardSchemaV1 | undefined
}

export interface GenerateEvent extends EventBase<"Generation"> {
  value: JSONValue
  schema?: object
}
