import { L, Tool } from "liminal"
import * as mathjs from "mathjs"
import { gpt4oMini } from "./_common.ts"

const mathTool = await Tool.make(
  "A tool for evaluating mathematical expressions.",
  L.array(L.string),
  mathjs.evaluate,
)

const tools = new Set([mathTool])

const answer = await L.run(function*() {
  yield* L.focus(gpt4oMini)
  yield* L.user`
    A taxi driver earns $9461 per 1-hour of work. If he works 12 hours a day and in 1 hour
    he uses 12 liters of petrol with a price  of $134 for 1 liter. How much money does he earn in one day?
  `
  return yield* L.assistant
}, {
  handler: console.log,
  tools,
})

console.log(answer)
