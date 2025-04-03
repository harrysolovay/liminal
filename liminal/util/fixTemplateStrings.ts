const INDENTATION_RE = /^\n([ \t]+)/
export function fixTemplateStrings(template: TemplateStringsArray): { readonly raw: readonly string[] } {
  const indentation = INDENTATION_RE.exec(template.raw[0]!)?.[1]
  return {
    raw: template.raw.map((a) =>
      (indentation ? a.replaceAll(`\n${indentation}`, "\n") : a)
        // escaped next lines
        .replace("\\\n", "")
        .replaceAll("\\`", "`")
        .replaceAll("\\$", "$")
        .replaceAll("\\{", "{")
    ),
  }
}
