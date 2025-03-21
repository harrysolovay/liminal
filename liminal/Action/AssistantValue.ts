import type { StandardSchemaV1 } from "@standard-schema/spec"

export function* AssistantObject<T>(type: StandardSchemaV1<unknown, T>): Generator<AssistantObject<T>, T> {
  return yield {
    kind: "AssistantObject",
    type,
  }
}

export interface AssistantObject<T = any> {
  kind: "AssistantObject"
  type: StandardSchemaV1<unknown, T>
}
