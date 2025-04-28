import { L } from "liminal"
import { debate } from "liminal-strands"
import { writeFile } from "node:fs/promises"
import { mistralSmall31 } from "./_models.ts"

const result = await L.strand(function*() {
  yield* L.model(mistralSmall31)

  return yield* debate({
    topic: "Should we use AI to write code?",
  })
}, {
  async handler(event) {
    console.log(this.depth, event)
    if (event.type === "fiber_status_changed" && event.status.type === "resolved" && this.depth === 1) {
      await writeFile("./debate.json", JSON.stringify(event.status.value, null, 2))
    }
  },
})

console.log(result)
