import { fixTemplateStrings } from "./fixTemplateStrings.ts"

export function dedent(input: TemplateStringsArray, ...values: Array<unknown>): string {
  return String.raw(fixTemplateStrings(input), ...values)
}
