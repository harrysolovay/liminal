export function* Model<K extends keyof any>(key: K): Generator<Model<K>, undefined> {
  return yield {
    kind: "Model",
    key,
  }
}

export interface Model<K extends keyof any = keyof any> {
  kind: "Model"
  key: K
}
