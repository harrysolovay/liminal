import { L } from "liminal"
import { writeFile } from "node:fs/promises"
import { debate } from "strandard/debate"
import { gpt4oMini } from "./_models.ts"

const result = await L.strand(function*() {
  yield* L.model(gpt4oMini)

  return yield* debate({
    topic: "Should we use AI to write code?",
  })
}, {
  async handler(event) {
    console.log(this.depth, event)
    if (event.type === "fiber_resolved" && this.depth) {
      await writeFile("./debate.json", JSON.stringify(event.value, null, 2))
    }
  },
})

console.log(result)
