import type { Falsy } from "../../util/Falsy.ts"
import type { TypeMembers } from "./_TypeMembers.ts"

export * as Type from "./_types/mod.ts"

export interface Type<T = any> extends TypeMembers<T> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<Falsy | string>): this

  T: T
}
