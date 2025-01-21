import type { Falsy } from "../../util/Falsy.ts"
import type { Rune } from "./_Rune.ts"
import type { JSONType } from "./JSONType.ts"

export * as Type from "./_types/mod.ts"

export interface Type<T = any> extends Rune<"Type", T>, TypeMembers {
  (template: TemplateStringsArray, ...substitutions: Array<AnnotationSubstitution>): this
  (...values: Array<AnnotationValue>): this
}

export interface TypeMembers {
  annotations: Array<Annotation>
  description(): undefined | string
  schema(): JSONType
}

export type AnnotationSubstitution = string
export type AnnotationValue = Falsy | string
export type Annotation = AnnotationValue | AnnotationTemplate
export interface AnnotationTemplate {
  template: TemplateStringsArray
  substitutions: Array<AnnotationSubstitution>
}
