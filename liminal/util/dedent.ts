import { fixTemplateStrings } from "./fixTemplateStrings"

export function dedent(input: TemplateStringsArray, ...values: Array<unknown>): string {
  return String.raw(fixTemplateStrings(input), ...values)
}
