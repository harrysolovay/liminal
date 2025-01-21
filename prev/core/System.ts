import { isTemplateStringsArray } from "../../util/isTemplateStringsArray.ts"

export interface System {
  kind: "System"
  instructions: string
}

export function System(
  template: TemplateStringsArray,
  ...substitutions: Array<string>
): Generator<System, () => void>
export function System(instructions: string): Generator<System, () => void>
export function* System(
  e0: TemplateStringsArray | string,
  ...rest: Array<string>
): Generator<System, () => void> {
  return yield {
    kind: "System",
    instructions: isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0,
  }
}
