export function* Embedding(value: any): Generator<Embedding, Array<number>> {
  return yield {
    kind: "Embedding",
    value,
  }
}

export interface Embedding {
  kind: "Embedding"
  value: any
}
