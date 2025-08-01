export type Taggable<T> = {
  (value: string): T
  (template: TemplateStringsArray, ...substitutions: Array<unknown>): T
  (template: string | TemplateStringsArray, ...substitutions: Array<unknown>): T
}

export type TaggableNullable<T> = {
  (value?: string | undefined): T
  (template: TemplateStringsArray, ...substitutions: Array<unknown>): T
  (template?: string | TemplateStringsArray | undefined, ...substitutions: Array<unknown>): T
}

export const normalize = <A0 extends string | TemplateStringsArray | undefined>(
  a0: A0,
  aRest: Array<unknown> = [],
): string | (undefined extends A0 ? undefined : never) =>
  a0 ? typeof a0 === "string" ? a0 : String.raw(a0, aRest) : undefined as never
