import { L } from "liminal"
import { gpt4oMini, handler } from "./_common.ts"

const Activity = L.object({
  title: L.string,
  description: L.string,
  location: L.string,
  estimatedCostUSD: L.array(L.string),
  forWhom: L.string`Description of the kind of person that would enjoy this activity.`,
})

await L.run(
  function*() {
    yield* L.focus(gpt4oMini)
    yield* L.system`When you are asked a question, answer without asking for clarification.`
    yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
    let i = 0
    const activities: Array<typeof Activity.T> = []
    while (i < 5) {
      activities.push(yield* L.assistant(Activity))
      yield* L.user`Another please.`
      i++
    }
  },
  { handler },
)
