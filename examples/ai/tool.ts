import { openai } from "@ai-sdk/openai"
import * as mathjs from "mathjs"
import { agent, Type, system } from "liminal"
import { AIExec } from "liminal-ai"

await AIExec(
  function* () {
    yield* system`
      You are solving math problems. Reason step by step. Use the calculator when necessary.
      When you give the final answer, provide an explanation for how you arrived at it.
    `

    yield* agent`
      A tool for evaluating mathematical expressions. Example expressions:

      - \`1.2 * (2 + 4.5)\`
      - \`12.7 cm to inch\`
      - \`sin(45 deg) ^ 2\`
    `(Type.array(Type.string), mathjs.evaluate)()

    yield `
      A taxi driver earns $9461 per 1-hour of work. If he works 12 hours a day and in 1 hour
      he uses 12 liters of petrol with a price  of $134 for 1 liter. How much money does he earn in one day?
    `

    console.log(yield* Type.string)
  },
  openai("gpt-4o-2024-08-06", { structuredOutputs: true }),
).consume()
