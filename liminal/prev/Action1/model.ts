export function* model<K extends string>(tag: K): Generator<Model<K>, () => void> {
  return yield {
    kind: "Model",
    tag,
  }
}

export interface Model<K extends string> {
  kind: "Model"
  tag: K
}
