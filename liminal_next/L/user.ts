import type { AppendMessage } from "../runes/AppendMessage.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { append } from "./append.ts"

export interface user extends Iterable<AppendMessage, void> {}

export function user(template: TemplateStringsArray, ...substitutions: Array<string>): user
export function user(value: string): user
export function user(e0: TemplateStringsArray | string, ...rest: Array<string>): user {
  return append("user", isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0)
}
