import { type } from "arktype"
import { L } from "liminal"
import { fromArktype } from "liminal-schema/arktype"

export default function*() {
  // yield* L.model(openai("gpt-4o-mini"))
  yield* L.system`When you are asked a question, answer without asking for clarification.`
  yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
  let i = 0
  const activities: Array<typeof Activity.T> = []
  while (i < 5) {
    activities.push(yield* L.assistant(Activity))
    yield* L.user`Another please.`
    i++
  }
  console.log(activities)
}

const Activity = fromArktype(type({
  title: "string",
  description: "string",
  location: "string",
  estimatedCostUSD: "number[]",
  forWhom: type("string").describe("Description of the kind of person that would enjoy this activity."),
}))
