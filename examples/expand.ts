import { L } from "liminal"
import { expand } from "liminal-strands"
import { writeFile } from "node:fs/promises"
import { gpt4oMini } from "./_common.ts"

await L.run(
  function*() {
    yield* L.focus(gpt4oMini)

    return yield* expand({
      input: `
        If something is fragile, its risk of breaking makes
        anything you to improve it or make it efficient inconsequential,
        unless you first reduce that risk of breaking.
      `,
      size: 5,
      goals: [
        "Ensure that the ideas––while kept general––can be contextualized in commonplace scenarios.",
        "Be both a realist and an optimist.",
      ],
    })
  },
  {
    async handler(event) {
      console.log(this.depth, event)
      if (event.type === "strand_status_changed" && event.status.type === "resolved" && this.depth === 0) {
        await writeFile("./expansion.json", JSON.stringify(event.status.value, null, 2))
      }
    },
  },
)
