import { Agent, L } from "liminal"
import { gpt4oMini } from "./models.ts"

await Agent(async function*() {
  yield* L.model(gpt4oMini)
  yield* L.user`Write a rap about type-level programming in TypeScript.`
  for await (const chunk of yield* L.stream) {
    console.log(chunk)
  }
})
