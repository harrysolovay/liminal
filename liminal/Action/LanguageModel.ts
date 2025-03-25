export function* LanguageModel<K extends string>(key: K): Generator<LanguageModel<K>, undefined> {
  return yield {
    kind: "LanguageModel",
    key: key,
  }
}

export interface LanguageModel<K extends string = string> {
  kind: "LanguageModel"
  key: K
}
