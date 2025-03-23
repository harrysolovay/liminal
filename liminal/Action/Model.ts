export function* Model<K extends string>(key: K): Generator<Model<K>, undefined> {
  return yield {
    kind: "Model",
    key: key,
  }
}

export interface Model<K extends string = string> {
  kind: "Model"
  key: K
}
