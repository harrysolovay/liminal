import { L as T } from "liminal"
import { L } from "liminal_next"

export default function*() {
  // yield* L.model(openai("gpt-4o-mini"))
  yield* L.system`When you are asked a question, answer without asking for clarification.`
  yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
  let i = 0
  const activities: Array<typeof Activity["T"]> = []
  while (i < 5) {
    activities.push(yield* Activity)
    yield* L.user`Another please.`
    i++
  }
  console.log(activities)
}

const Activity = T.object({
  title: T.string,
  description: T.string,
  location: T.string,
  estimatedCostUSD: T.option(T.number),
  forWhom: T.string`Description of the kind of person that would enjoy this activity.`,
})
