import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { fixTemplateStrings } from "../util/fixTemplateStrings.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { message } from "./message.ts"

export function system(
  template: TemplateStringsArray,
  ...substitutions: Array<number | string>
): Generator<Rune<LEvent>, void>
export function system(value: string): Generator<Rune<LEvent>, void>
export function system(
  e0: TemplateStringsArray | string,
  ...rest: Array<number | string>
): Generator<Rune<LEvent>, void> {
  return message("system", [{
    part: isTemplateStringsArray(e0) ? String.raw(fixTemplateStrings(e0), ...rest) : e0,
  }])
}
