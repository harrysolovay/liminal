import { L } from "liminal"
import { gpt4oMini } from "./_common.ts"

await L.run(
  async function*() {
    yield* L.model(gpt4oMini)
    yield* L.user`Write a rap about type-level programming in TypeScript.`
    for await (const chunk of yield* L.stream) {
      console.log(chunk)
    }
  },
  { handler: console.log },
)
