import { type } from "arktype"
import "liminal-arktype/register"
import { Agent, L, Tool, ToolRegistry } from "liminal"
import * as mathjs from "mathjs"
import models from "./models.ts"

const mathTool = await Tool.make(
  "MathTool",
  type({
    expression: "string[]",
  }),
  ({ expression }) => mathjs.evaluate(expression),
)

const tools = new ToolRegistry([mathTool])

const answer = await Agent(
  function*() {
    yield* L.model(models.gpt4oMini)
    yield* L.user`
      A taxi driver earns $9461 per 1-hour of work. If he works 12 hours a day and in 1 hour
      he uses 12 liters of petrol with a price  of $134 for 1 liter. How much money does he earn in one day?
    `
    return yield* L.assistant
  },
  {
    handler: console.log,
    tools,
  },
)

console.log(answer)
