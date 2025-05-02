import { L } from "liminal"
import { debate } from "liminal-strands"
import { mistralSmall31 } from "./_common.ts"

const result = await L.run(
  function*() {
    yield* L.model(mistralSmall31)
    return yield* debate({
      topic: "Should we use AI to write code?",
    })
  },
  { handler: console.log },
)

console.log(result)
