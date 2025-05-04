import { L } from "liminal"
import { socratic } from "liminal-strands"
import { gpt4oMini } from "./_common.ts"

await L.run(
  function*() {
    yield* L.focus(gpt4oMini)
    return yield* socratic({
      topic: "Is it wrong to love cheesy vampire movies?",
      rounds: 5,
    })
  },
  { handler: console.log },
)
