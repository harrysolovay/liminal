import type { StandardSchemaV1 } from "@standard-schema/spec"

export function* AssistantValue<T>(type: StandardSchemaV1<unknown, T>): Generator<AssistantValue<T>, T> {
  return yield {
    kind: "AssistantValue",
    type,
  }
}

export interface AssistantValue<T = any> {
  kind: "AssistantValue"
  type: StandardSchemaV1<unknown, T>
}
