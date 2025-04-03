import { dedent } from "./dedent.ts"
import { isTemplateStringsArray } from "./isTemplateStringsArray.ts"

export function normalizeTemplateArgs<T>(
  ...[maybeTemplate, ...substitutions]: [content: T] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): string | T {
  return isTemplateStringsArray(maybeTemplate)
    ? String.raw({ raw: maybeTemplate.map((s) => dedent(s).replaceAll("\\`", "`")) }, ...substitutions)
    : maybeTemplate
}
