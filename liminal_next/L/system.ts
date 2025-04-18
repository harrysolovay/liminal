import type { AppendMessage } from "../runes/AppendMessage.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { _append } from "./_append.ts"
import type { LBase } from "./_LBase.ts"

export interface system extends LBase<AppendMessage, void> {}

export function system(template: TemplateStringsArray, ...substitutions: Array<string>): system
export function system(value: string): system
export function system(e0: TemplateStringsArray | string, ...rest: Array<string>): system {
  return _append("system", isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0)
}
