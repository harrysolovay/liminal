export function* V(value: any): Generator<V, Array<number>> {
  return yield {
    kind: "V",
    value,
  }
}

export interface V {
  kind: "V"
  value: any
}
