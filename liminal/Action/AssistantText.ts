export function* AssistantText(): Generator<AssistantText, string> {
  return yield {
    kind: "AssistantText",
  }
}

export interface AssistantText {
  kind: "AssistantText"
}
