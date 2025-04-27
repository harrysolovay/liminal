import { L } from "liminal"
import { writeFile } from "node:fs/promises"
import { expand } from "strandard/expand"
import { gpt4oMini } from "./_models.ts"

await L.strand(
  function*() {
    yield* L.model(gpt4oMini)

    return yield* expand({
      input: `
        If something is fragile, its risk of breaking makes
        anything you to improve it or make it efficient inconsequential,
        unless you first reduce that risk of breaking.
      `,
      size: 10,
      goals: [
        "Ensure that the ideas––while kept general––can be contextualized in commonplace scenarios.",
        "Be both a realist and an optimist.",
      ],
    })
  },
  {
    async handler(event) {
      console.log(this.depth, event)
      if (event.type === "fiber_resolved" && this.depth) {
        await writeFile("./expansion.json", JSON.stringify(event.value, null, 2))
      }
    },
  },
)
