const INDENTATION_RE = /^\n([ \t]+)/
const ESCAPE_SEQ_RE = /\\([`${\\]|\n)/g
const LAST_INDENTATION_RE = /\n[ \t]+$/

export function fixTemplateStrings(template: TemplateStringsArray): { readonly raw: readonly string[] } {
  const firstSegment = template.raw[0]!
  const leadingIndentMatch = INDENTATION_RE.exec(firstSegment)
  const indentation = leadingIndentMatch?.[1]

  const rawLength = template.raw.length
  const result = new Array(rawLength)

  for (let i = 0; i < rawLength; i++) {
    let str = template.raw[i]!
    // Only perform common indentation replacements if needed
    if (indentation) {
      // Remove leading newline and indentation in the first segment
      if (i === 0) {
        str = str.slice(indentation.length + 1)
      }
      // Use a simple string replacement with a regular expression for better performance
      str = str.replaceAll(`\n${indentation}`, "\n")
    }

    // Replace common escape sequences in a single pass
    str = str.replace(ESCAPE_SEQ_RE, (_match, char) => {
      // Keep the escaped newline replacement separate for clarity
      return char === "\n" ? "" : char
    })

    // Handle trailing spaces only for the last segment
    if (indentation && i === rawLength - 1) {
      str = str.replace(LAST_INDENTATION_RE, "")
    }

    result[i] = str
  }

  return { raw: result }
}

const LEADING_SPACE_RE = /^([ \t]*)/
/**
 * Applies template string indentation to substituted values with line breaks
 *
 * @param strings - The template strings array (processed through fixTemplateStrings)
 * @param values - The substitution values
 * @returns - The formatted string with properly indented substitutions
 */
export function applyTemplateWithIndentation(strings: TemplateStringsArray, ...values: any[]): string {
  const fixedStrings = fixTemplateStrings(strings)
  const rawArr = fixedStrings.raw
  const valuesLength = values.length

  const resultParts = new Array(Math.max(1, rawArr.length * 2 - 1))
  let resultIndex = 0

  for (let i = 0; i < rawArr.length; i++) {
    const str = rawArr[i] || ""
    resultParts[resultIndex++] = str

    // Only process values for non-final segments
    if (i < valuesLength) {
      const value = String(values[i])

      // If value has line breaks, we should indent it
      if (value.includes("\n")) {
        const lastNewlineIndex = str.lastIndexOf("\n")

        if (lastNewlineIndex !== -1) {
          // Extract the indentation after the last newline
          const textAfterLastNewline = str.substring(lastNewlineIndex + 1)
          const leadingSpaceMatch = LEADING_SPACE_RE.exec(textAfterLastNewline)
          const indentationToApply = leadingSpaceMatch && leadingSpaceMatch[1] ? leadingSpaceMatch[1] : ""

          if (indentationToApply) {
            // Split the value into lines once
            const lines = value.split("\n")
            const linesLength = lines.length

            // First line doesn't need indentation
            resultParts[resultIndex++] = lines[0]

            // Apply indentation to subsequent lines
            for (let j = 1; j < linesLength; j++) {
              resultParts[resultIndex++] = "\n" + indentationToApply + lines[j]
            }
            continue
          }
        }
      }
      // For simple values or when no indentation is needed
      resultParts[resultIndex++] = value
    }
  }

  // Combine all parts at once
  return resultParts.slice(0, resultIndex).join("")
}
