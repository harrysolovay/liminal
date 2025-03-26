import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { JSONValue } from "../util/JSONValue.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* Embedding(value: JSONValue, type?: StandardSchemaV1): Generator<Embedding, Array<number>> {
  return yield ActionBase("Embedding", { value, type })
}

export interface Embedding extends ActionBase<"Embedding"> {
  value: JSONValue
  type: StandardSchemaV1 | undefined
}

export interface EmbeddingEvent extends EventBase<"Embedding"> {
  value: JSONValue
  schema?: object
  embedding: Array<number>
}
