import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { message } from "./message.ts"

export function user(
  template: TemplateStringsArray,
  ...substitutions: Array<number | string>
): Generator<Rune<LEvent>, void>
export function user(value: string): Generator<Rune<LEvent>, void>
export function user(
  e0: TemplateStringsArray | string,
  ...rest: Array<number | string>
): Generator<Rune<LEvent>, void> {
  return message("user", [{
    part: isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0,
  }])
}
