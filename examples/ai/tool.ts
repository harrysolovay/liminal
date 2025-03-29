import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Context, Generation, Model, Tool } from "liminal"
import { AILanguageModel } from "liminal-ai"
import * as mathjs from "mathjs"

ToolUser().exec({
  models: {
    language: {
      default: AILanguageModel(openai("gpt-4o-mini")),
    },
  },
  handler: console.log,
})

function ToolUser() {
  return Context(
    "ToolUser",
    `
      You are solving math problems. Reason step by step. Use the calculator when necessary.
      When you give the final answer, provide an explanation for how you arrived at it.
    `,
    function*() {
      yield* Model("default")
      yield `
        A taxi driver earns $9461 per 1-hour of work. If he works 12 hours a day and in 1 hour
        he uses 12 liters of petrol with a price  of $134 for 1 liter. How much money does he earn in one day?
      `
      yield* Tool(
        "MathTool",
        `
          A tool for evaluating mathematical expressions. Example expressions:

          - \`1.2 * (2 + 4.5)\`
          - \`12.7 cm to inch\`
          - \`sin(45 deg) ^ 2\`
        `,
        type({
          expr: type.string.array(),
        }),
        ({ expr }) => mathjs.evaluate(expr),
      )
      return yield* Generation()
    },
  )
}
