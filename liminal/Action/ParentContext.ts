export function* ParentContext(): Generator<ParentContext, Array<string>> {
  return yield {
    kind: "ParentContext",
  }
}

export interface ParentContext {
  kind: "ParentContext"
}
