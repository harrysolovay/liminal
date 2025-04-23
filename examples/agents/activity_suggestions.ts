import { Agent, L } from "liminal"
import { openai } from "liminal-openai"
import "liminal-arktype/register"
import { type } from "arktype"

const Activity = type({
  title: "string",
  description: "string",
  location: "string",
  estimatedCostUSD: "number[]",
  forWhom: type("string").describe("Description of the kind of person that would enjoy this activity."),
})

await Agent(
  function*() {
    yield* L.model(openai("gpt-4o-mini"))
    yield* L.system`When you are asked a question, answer without asking for clarification.`
    yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
    let i = 0
    const activities: Array<typeof Activity.infer> = []
    while (i < 5) {
      activities.push(yield* L.assistant(Activity))
      yield* L.user`Another please.`
      i++
    }
  },
  {
    handler: (event) => {
      return console.log(event)
    },
  },
)
