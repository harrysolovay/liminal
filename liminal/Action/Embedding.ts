import type { JSONValue } from "../util/JSONValue.js"

export function* Embedding(value: JSONValue): Generator<Embedding, Array<number>> {
  return yield {
    kind: "Embedding",
    value,
  }
}

export interface Embedding {
  kind: "Embedding"
  value: JSONValue
}
