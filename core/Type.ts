import type { Annotation, Param, TemplatePart } from "./annotations/mod.ts"
import type { JSONType } from "./JSONSchema.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"

export interface Type<T, D extends symbol = never> extends TypeDeclaration {
  <A extends Array<Annotation<T>>>(
    ...annotations: A | Array<Annotation<T>> & { length: never }
  ): Type<T, ReduceDependencies<D, A>>

  <A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceDependencies<D, A>>

  T: T
  D: D

  node: "Type"
  trace: string
  annotations: Array<Annotation>

  extract<K extends symbol, V>(param: Param<K, V>): Array<V>
  description(): string | undefined

  display(depth?: number): string
  signature(): string
  schema(): JSONType

  deserialize(jsonText: string): T
  assert(value: unknown): asserts value is T
  is(value: unknown): value is T
}

export interface TypeDeclaration {
  type: string
  self: () => AnyType | ((...args: any) => AnyType)
  args?: Array<unknown>
}

export type AnyType<T = any> = Type<T, symbol>

export type DerivedType<
  T,
  X extends Array<AnyType>,
  P extends symbol = never,
> = [Type<T, P | X[number]["D"]>][0]
