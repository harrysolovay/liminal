import type { Rune } from "../Rune.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { _message } from "./_message.ts"

export function user(template: TemplateStringsArray, ...substitutions: Array<string>): Generator<Rune, void>
export function user(value: string): Generator<Rune, void>
export function user(e0: TemplateStringsArray | string, ...rest: Array<string>): Generator<Rune, void> {
  return _message("user", isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0)
}
