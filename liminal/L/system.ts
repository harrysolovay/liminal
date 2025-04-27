import { isTemplateStringsArray } from "liminal-util"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { message } from "./message.ts"

export interface system extends Generator<Rune<LEvent>, void> {}

export function system(template: TemplateStringsArray, ...substitutions: Array<number | string>): system
export function system(value: string): system
export function system(e0: TemplateStringsArray | string, ...rest: Array<number | string>): system {
  const part = isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0
  return message("system", [{ part }])
}
