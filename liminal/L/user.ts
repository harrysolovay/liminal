import { isTemplateStringsArray } from "liminal-util"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { message } from "./message.ts"

export interface user extends Generator<Rune<LEvent>, void> {}

export function user(template: TemplateStringsArray, ...substitutions: Array<string>): user
export function user(value: string): user
export function user(e0: TemplateStringsArray | string, ...rest: Array<string>): user {
  const part = isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0
  return message("user", [{ part }])
}
