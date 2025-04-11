import { L } from "liminal"

export default function*() {
  yield* L.declareModel("gemma3", "language")
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

const Activity = L.object({
  title: L.string,
  description: L.string,
  location: L.string,
  estimatedCostUSD: L.option(L.number),
  forWhom: L.string`Description of the kind of person that would enjoy this activity.`,
})
