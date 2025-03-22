export function* Context(): Generator<Context, Array<string>> {
  return yield {
    kind: "ParentContext",
  }
}

export interface Context {
  kind: "ParentContext"
}
