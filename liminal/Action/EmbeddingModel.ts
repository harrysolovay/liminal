export function* EmbeddingModel<K extends string>(key: K): Generator<EmbeddingModel<K>, undefined> {
  return yield {
    kind: "EmbeddingModel",
    key: key,
  }
}

export interface EmbeddingModel<K extends string = string> {
  kind: "EmbeddingModel"
  key: K
}
