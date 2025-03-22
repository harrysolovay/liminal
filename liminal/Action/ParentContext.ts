export function* ParentContext(): Generator<ParentContext, Array<string> | undefined> {
  return yield {
    kind: "ParentContext",
  }
}

export interface ParentContext {
  kind: "ParentContext"
}
