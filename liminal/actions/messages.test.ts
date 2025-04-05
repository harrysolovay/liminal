import { describe, expect, test } from "bun:test"
import * as L from "../L.ts"
import { takeFirstAction } from "../testing/takeFirstAction.ts"

describe("message templates", () => {
  test("system messages with indentation", async () => {
    // Create a system message with indented multiline content
    const messageGenerator = L.system`
      Hello, I am an AI assistant.
      I can help with the following:
        - Code generation
        - Answering questions
        - General assistance
    `

    const action = await takeFirstAction(messageGenerator)

    expect(action?.message.content).toBe(
      "Hello, I am an AI assistant.\nI can help with the following:\n  - Code generation\n  - Answering questions\n  - General assistance",
    )
  })

  test("user messages with substitution", async () => {
    const name = "John"
    const messageGenerator = L.user`Hello, my name is ${name}.`

    const action = await takeFirstAction(messageGenerator)

    expect(action?.message.content).toBe("Hello, my name is John.")
  })

  test("user messages with multiline substitution and indentation", async () => {
    const codeBlock = "function example() {\n  console.log('Hello');\n}"

    const messageGenerator = L.user`
      Here's my code:
        ${codeBlock}
      Can you help me understand it?
    `

    const action = await takeFirstAction(messageGenerator)

    // The code block should get indentation applied to lines after the first
    expect(action?.message.content).toBe(
      "Here's my code:\n  function example() {\n    console.log('Hello');\n  }\nCan you help me understand it?",
    )
  })

  test("assistant messages with multiline substitution", async () => {
    const explanation =
      "1. First, we declare a function\n2. Then we log a message\n3. The function doesn't return anything"

    const messageGenerator = L.assistant`
      Let me explain:
        ${explanation}
      Does that help?
    `

    const action = await takeFirstAction(messageGenerator)

    // The explanation lines should get indentation
    expect(action?.message.content).toBe(
      "Let me explain:\n  1. First, we declare a function\n  2. Then we log a message\n  3. The function doesn't return anything\nDoes that help?",
    )
  })

  test("preserves code indentation", async () => {
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

    const action = await takeFirstAction(messageGenerator)

    // The code's internal indentation structure should be preserved
    // while getting additional indentation from the template
    expect(action?.message.content).toBe(
      "My code:\n  if (condition) {\n    // This is indented once\n    if (nestedCondition) {\n      // This is indented twice\n    }\n  }",
    )
  })
})
