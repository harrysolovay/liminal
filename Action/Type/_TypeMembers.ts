import type { Type } from "./Type.ts"

export interface TypeMembers<T> extends Iterable<Type<T>, T> {
  kind: "Type"

  self: () => this | (() => this)
  args?: Array<unknown>

  descriptions: Array<string>
}
