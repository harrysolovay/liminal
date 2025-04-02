// TODO: should the name indicate the additional piece of functionality (unescaping backticks)?
// modified from denoland/std: https://github.com/denoland/std/blob/1db0c55a646699476a12e3053c00ba385c51e974/text/unstable_dedent.ts
export function dedent(input: TemplateStringsArray | string, ...values: Array<unknown>): string {
  const inputString = typeof input === "string" ? input : String.raw({ raw: input }, ...values)
  const ignoreFirstUnindented = !inputString.startsWith("\n")
  const trimmedInput = inputString.replace(/^\n/, "").trimEnd()
  const lines = trimmedInput.split("\n")

  let minIndentWidth: number | undefined = undefined
  for (let i = 0; i < lines.length; i++) {
    const indentMatch = lines[i]!.match(/^(\s*)\S/)
    if (indentMatch === null) {
      continue
    }
    const indentWidth = indentMatch[1]!.length
    if (ignoreFirstUnindented && i === 0 && indentWidth === 0) {
      continue
    }
    if (minIndentWidth === undefined || indentWidth < minIndentWidth) {
      minIndentWidth = indentWidth
    }
  }
  if (minIndentWidth === undefined || minIndentWidth === 0) {
    return trimmedInput
  }
  const minIndentRegex = new RegExp(`^\\s{${minIndentWidth}}`, "gm")
  return trimmedInput.replaceAll(minIndentRegex, "").replaceAll(/^\s+$/gm, "").replaceAll("\\`", "`")
}
