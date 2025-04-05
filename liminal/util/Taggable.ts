import { applyTemplateWithIndentation } from "./fixTemplateStrings.ts"
import { isTemplateStringsArray } from "./isTemplateStringsArray.ts"

export interface Taggable<A extends Array<any>> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: A): this
}

export type TaggableArgs<A extends Array<any>> = A | [
  raw: TemplateStringsArray,
  ...substitutions: Array<string>,
]

export function normalizeTaggableArgs<A extends Array<unknown>>(...[e0, ...eRest]: TaggableArgs<A>) {
  return isTemplateStringsArray(e0)
    ? [applyTemplateWithIndentation(e0, ...eRest)] as [string]
    : [e0, ...eRest] as A
}
