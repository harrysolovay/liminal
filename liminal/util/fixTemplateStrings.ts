const INDENTATION_RE = /^\n([ \t]+)/
export function fixTemplateStrings(template: TemplateStringsArray): { readonly raw: readonly string[] } {
  const indentation = INDENTATION_RE.exec(template.raw[0]!)?.[1]
  return {
    raw: template.raw.map((a, i, arr) => {
      let res = (indentation ? a.replaceAll(`\n${indentation}`, "\n") : a)
        // escaped next lines
        .replaceAll("\\\n", "")
        // fix weird things escaped in tag calls
        .replaceAll("\\`", "`")
        .replaceAll("\\$", "$")
        .replaceAll("\\{", "{")
      // fix trailing spaces
      if (indentation && i === arr.length - 1) res = res.replace(/\n[ \t]+$/, "")
      return res
    }),
  }
}
