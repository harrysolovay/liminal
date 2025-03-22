export function* Context(): Generator<Context, Array<string>> {
  return yield {
    kind: "Context",
  }
}

export interface Context {
  kind: "Context"
}
