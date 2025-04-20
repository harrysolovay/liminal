import { isTemplateStringsArray } from "liminal-util"
import type { StateRune } from "../Rune.ts"
import { _message } from "./_message.ts"

export function system(template: TemplateStringsArray, ...substitutions: Array<string>): Generator<StateRune, void>
export function system(value: string): Generator<StateRune, void>
export function system(e0: TemplateStringsArray | string, ...rest: Array<string>): Generator<StateRune, void> {
  return _message("system", isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0)
}
