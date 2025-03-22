import * as mathjs from "mathjs"
import { Agent, Assistant, AgentTool } from "liminal"
import { type } from "arktype"

export const tool = Agent(
  "Main",
  `
    You are solving math problems. Reason step by step. Use the calculator when necessary.
    When you give the final answer, provide an explanation for how you arrived at it.
  `,
  function* () {
    yield `
      A taxi driver earns $9461 per 1-hour of work. If he works 12 hours a day and in 1 hour
      he uses 12 liters of petrol with a price  of $134 for 1 liter. How much money does he earn in one day?
    `
    yield* AgentTool("MathTool", type.string.array(), MathAgent)
    return yield* Assistant()
  },
)

function MathAgent(expr: Array<string>) {
  return Agent(
    "MathAgent",
    `
      A tool for evaluating mathematical expressions. Example expressions:

      - \`1.2 * (2 + 4.5)\`
      - \`12.7 cm to inch\`
      - \`sin(45 deg) ^ 2\`
    `,
    // biome-ignore lint/correctness/useYield: <explanation>
    function* () {
      return mathjs.evaluate(expr) as number
    },
  )
}
