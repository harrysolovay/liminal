import type { Rune } from "../Rune.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { _message } from "./_message.ts"

export function system(template: TemplateStringsArray, ...substitutions: Array<string>): Generator<Rune, void>
export function system(value: string): Generator<Rune, void>
export function system(e0: TemplateStringsArray | string, ...rest: Array<string>): Generator<Rune, void> {
  return _message("system", isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0)
}
