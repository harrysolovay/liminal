import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import type { AssertionContext } from "./AssertionContext.ts"
import type { JSONType, JSONTypeName } from "./JSONSchema.ts"

export interface Type<T, P extends symbol> {
  <A extends Array<DescriptionTemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceP<P, A>>

  <A extends Array<Annotation<T>>>(...annotations: A): Type<T, ReduceP<P, A>>

  [TypeKey]: true

  T: T
  P: P

  type: "Type"
  trace: string
  declaration: TypeDeclaration
  annotations: Array<Annotation>

  description(): string
  signature(): string
  signatureHash(): Promise<string>
  metadata(): Record<symbol, unknown>
  toJSON(): JSONType
  assert(value: unknown): Promise<void>
  deserialize: (jsonText: string) => T
}

export const TypeKey: unique symbol = Symbol()

export function isType(value: unknown): value is AnyType {
  return typeof value === "function" && value !== null && TypeKey in value
}

export type TypeDeclaration =
  & {
    assert: (value: unknown, assertionContext: AssertionContext) => void
    jsonType: JSONTypeName
  }
  & ({
    getAtom: () => AnyType
    factory?: never
    args?: never
  } | {
    getAtom?: never
    factory: (...args: any) => AnyType
    args: unknown[]
  })

export type AnyType<T = any> = Type<T, symbol>
