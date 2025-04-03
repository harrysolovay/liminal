import { describe, expect, test } from "bun:test"
import { applyTemplateWithIndentation, fixTemplateStrings } from "./fixTemplateStrings"

// Helper to create a mock TemplateStringsArray
function createTemplateArray(strings: string[]): TemplateStringsArray {
  const arr = [...strings] as unknown as TemplateStringsArray
  Object.defineProperty(arr, "raw", { value: strings })
  return arr
}

// A template tag function that applies indentation to substitutions
function templateTag(strings: TemplateStringsArray, ...values: any[]): string {
  return applyTemplateWithIndentation(strings, ...values)
}

describe("fixTemplateStrings", () => {
  test("handles basic template strings without indentation", () => {
    const template = createTemplateArray(["hello", "world", "!"])
    const result = fixTemplateStrings(template)
    expect(result.raw).toEqual(["hello", "world", "!"])
  })

  test("removes common indentation from multiline strings", () => {
    const template = createTemplateArray([`
        first line
        second line
        third line`])

    const result = fixTemplateStrings(template)
    // Leading newline should be removed
    expect(result.raw[0]).toBe("first line\nsecond line\nthird line")
  })

  test("handles escaped characters", () => {
    const template = createTemplateArray(["\\`template\\$\\{with\\}escaped\\nchars"])
    const result = fixTemplateStrings(template)
    // The function only unescapes backticks, dollar signs, and opening braces
    expect(result.raw[0]).toBe("`template${with\\}escaped\\nchars")
  })

  test("preserves intended backticks and dollar signs", () => {
    const template = createTemplateArray(["const code = `const value = ${'test'}`"])
    const result = fixTemplateStrings(template)
    expect(result.raw[0]).toBe("const code = `const value = ${'test'}`")
  })

  test("removes trailing spaces in last segment", () => {
    const template = createTemplateArray([`
        some text
        with trailing spaces   
        `])

    const result = fixTemplateStrings(template)
    // The function only removes trailing spaces after a newline at the end
    // And only if indentation is detected
    // Leading newline should be removed
    expect(result.raw[0]).toBe("some text\nwith trailing spaces   \n")
  })

  test("handles mixed indentation", () => {
    const template = createTemplateArray([`
        spaces here
          more spaces
      less spaces
            most spaces`])

    const result = fixTemplateStrings(template)
    // The function uses the indentation of the first line as the baseline
    // Leading newline should be removed
    expect(result.raw[0]).toBe("spaces here\n  more spaces\n      less spaces\n    most spaces")
  })

  test("removes escaped newlines", () => {
    const template = createTemplateArray(["first line\\\nsecond line\\\nthird line"])
    const result = fixTemplateStrings(template)
    expect(result.raw[0]).toBe("first linesecond linethird line")
  })

  test("handles multiple segments with indentation", () => {
    const template = createTemplateArray([
      `
        first \${`,
      `}
        second \${`,
      `}
        third
      `,
    ])

    const result = fixTemplateStrings(template)
    // Leading newline should be removed in first segment only
    expect(result.raw).toEqual([
      "first ${",
      "}\nsecond ${",
      "}\nthird",
    ])
  })
})

describe("templateTag with indentation", () => {
  test("basic template with substitution", () => {
    const result = templateTag`Hello ${"world"}!`
    expect(result).toBe("Hello world!")
  })

  test("multiline template with indentation", () => {
    const result = templateTag`
      This is a multiline
      string with proper indentation
    `
    // Leading newline should be removed
    expect(result).toBe("This is a multiline\nstring with proper indentation")
  })

  test("template with multiline substitution without indentation", () => {
    const multilineValue = "line1\nline2\nline3"
    const result = templateTag`Value: ${multilineValue}`
    // The substitution doesn't get indentation because there's no preceding newline
    expect(result).toBe("Value: line1\nline2\nline3")
  })

  test("template with multiline substitution with indentation", () => {
    const multilineValue = "line1\nline2\nline3"
    const result = templateTag`
      Values:
        ${multilineValue}
      End of values
    `
    // The substitution should get the indentation from before the ${}
    // Leading newline should be removed
    expect(result).toBe("Values:\n  line1\n  line2\n  line3\nEnd of values")
  })

  test("nested indentation with multiline values", () => {
    const codeBlock = "function example() {\n  console.log('test');\n}"
    const result = templateTag`
      Here is some code:
        ${codeBlock}
      End of code
    `
    // The function should preserve the internal indentation of the code block
    // Leading newline should be removed
    expect(result).toBe("Here is some code:\n  function example() {\n    console.log('test');\n  }\nEnd of code")
  })

  test("mixed indentation with tabs and spaces", () => {
    const tabIndentedValue = "line1\n\tline2\n\t\tline3"
    const result = templateTag`
      Tab indented:
        ${tabIndentedValue}
      End
    `
    // Space indentation should be applied to all lines including those with tabs
    // Leading newline should be removed
    expect(result).toBe("Tab indented:\n  line1\n  \tline2\n  \t\tline3\nEnd")
  })

  test("numbered list with indented content", () => {
    const listItems = "1\n2\n3"
    const result = templateTag`
      1. Part one:
        ${listItems}
      2. Part two
    `
    // This is specifically testing the case mentioned by the user
    // Leading newline should be removed
    expect(result).toBe("1. Part one:\n  1\n  2\n  3\n2. Part two")
  })

  test("complex nested structures", () => {
    const jsonData = `{
  "name": "example",
  "values": [1, 2, 3]
}`
    const code = `function test() {
  if (condition) {
    return true;
  }
  return false;
}`

    const result = templateTag`
      JSON data:
        ${jsonData}
      
      Code:
        ${code}
      
      End of examples
    `

    // The code gets additional indentation due to the spacing before the interpolation
    // Leading newline should be removed
    expect(result).toBe(`JSON data:
  {
    "name": "example",
    "values": [1, 2, 3]
  }

Code:
  function test() {
    if (condition) {
      return true;
    }
    return false;
  }

End of examples`)
  })

  test("preserves indentation within code blocks", () => {
    const code = `if (true) {
  console.log("indented");
    console.log("double indented");
}`

    const result = templateTag`
      Code example:
        ${code}
      End
    `

    // The indentation is applied to each line based on the template's indentation
    // Leading newline should be removed
    expect(result).toBe(`Code example:
  if (true) {
    console.log("indented");
      console.log("double indented");
  }
End`)
  })

  test("handles empty lines in substitutions", () => {
    const textWithEmptyLines = "line1\n\nline3"

    const result = templateTag`
      Text:
        ${textWithEmptyLines}
      End
    `

    // Empty lines also get indentation
    // Leading newline should be removed
    expect(result).toBe(`Text:
  line1
  
  line3
End`)
  })
})
