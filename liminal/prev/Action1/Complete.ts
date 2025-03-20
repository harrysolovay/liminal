import type { StandardSchemaV1 } from "@standard-schema/spec"

export interface Complete {
  kind: "Complete"
  typeLike?: StandardSchemaV1
}

export function* complete<T = string>(typeLike?: StandardSchemaV1<any, T>): Generator<Complete, T> {
  return yield {
    kind: "Complete",
    typeLike,
  }
}
