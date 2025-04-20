import { isTemplateStringsArray } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { _message } from "./_message.ts"

export interface user extends Generator<Rune, void> {}

export function user(template: TemplateStringsArray, ...substitutions: Array<string>): user
export function user(value: string): user
export function user(e0: TemplateStringsArray | string, ...rest: Array<string>): user {
  return _message("user", isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0)
}
