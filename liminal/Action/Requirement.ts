export function* Requirement<K extends keyof any>(key: K): Generator<Requirement<K>, undefined> {
  return yield {
    kind: "Requirement",
    key,
  }
}

export interface Requirement<K extends keyof any = keyof any> {
  kind: "Requirement"
  key: K
}
