import { Agent, L } from "liminal"
import { openai } from "liminal-openai"
import "liminal-arktype/register"
import "liminal-effect/register"
import "liminal-zod3/register"
import { type } from "arktype"
import { Schema } from "effect"
import { z } from "zod"

const Activity = type({
  title: "string",
  description: "string",
  location: "string",
  estimatedCostUSD: "number[]",
  forWhom: type("string").describe("Description of the kind of person that would enjoy this activity."),
})

const ZodActivity = z.object({
  title: z.string(),
  description: z.string(),
})

const eType = Schema.Struct({
  value: Schema.String,
})

await Agent(
  function*() {
    yield* L.model(openai("gpt-4o-mini"))
    yield* L.system`When you are asked a question, answer without asking for clarification.`
    yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
    let i = 0
    const activities: Array<typeof Activity.infer> = []
    while (i < 5) {
      // yield* L.assistant()
      const x = yield* L.assistant(Activity)
      const y = yield* L.assistant(ZodActivity)
      yield* L.assistant(eType)
      // activities.push(x)
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
