import { describe, expect, test } from "bun:test"
import * as L from "../L.ts"

// Helper function to extract the content from a generator
function getMessageContent<T>(generator: Generator<T, void, any>): any {
  const result = generator.next()
  return (result.value as any)?.content
}

describe("message templates", () => {
  test("system messages with indentation", () => {
    // Create a system message with indented multiline content
    const messageGenerator = L.system`
      Hello, I am an AI assistant.
      I can help with the following:
        - Code generation
        - Answering questions
        - General assistance
    `

    const content = getMessageContent(messageGenerator)

    expect(content).toBe(
      "Hello, I am an AI assistant.\nI can help with the following:\n  - Code generation\n  - Answering questions\n  - General assistance",
    )
  })

  test("user messages with substitution", () => {
    const name = "John"
    const messageGenerator = L.user`Hello, my name is ${name}.`

    const content = getMessageContent(messageGenerator)

    expect(content).toBe("Hello, my name is John.")
  })

  test("user messages with multiline substitution and indentation", () => {
    const codeBlock = "function example() {\n  console.log('Hello');\n}"

    const messageGenerator = L.user`
      Here's my code:
        ${codeBlock}
      Can you help me understand it?
    `

    const content = getMessageContent(messageGenerator)

    // The code block should get indentation applied to lines after the first
    expect(content).toBe(
      "Here's my code:\n  function example() {\n    console.log('Hello');\n  }\nCan you help me understand it?",
    )
  })

  test("assistant messages with multiline substitution", () => {
    const explanation =
      "1. First, we declare a function\n2. Then we log a message\n3. The function doesn't return anything"

    const messageGenerator = L.assistant`
      Let me explain:
        ${explanation}
      Does that help?
    `

    const content = getMessageContent(messageGenerator)

    // The explanation lines should get indentation
    expect(content).toBe(
      "Let me explain:\n  1. First, we declare a function\n  2. Then we log a message\n  3. The function doesn't return anything\nDoes that help?",
    )
  })

  test("preserves code indentation", () => {
    const code = `if (condition) {
  // This is indented once
  if (nestedCondition) {
    // This is indented twice
  }
}`

    const messageGenerator = L.user`
      My code:
        ${code}
    `

    const content = getMessageContent(messageGenerator)

    // The code's internal indentation structure should be preserved
    // while getting additional indentation from the template
    expect(content).toBe(
      "My code:\n  if (condition) {\n    // This is indented once\n    if (nestedCondition) {\n      // This is indented twice\n    }\n  }",
    )
  })
})
