import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"

export interface Directive {
  kind: "Directive"
  instructions: string
}

export function directive(
  template: TemplateStringsArray,
  ...substitutions: Array<string>
): Generator<Directive, () => void>
export function directive(instructions: string): Generator<Directive, () => void>
export function* directive(
  e0: TemplateStringsArray | string,
  ...rest: Array<string>
): Generator<Directive, () => void> {
  return yield {
    kind: "Directive",
    instructions: isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0,
  }
}
