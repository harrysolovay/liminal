import { openai } from "@ai-sdk/openai"
import { L } from "liminal"
import { adapter } from "liminal-ai"

export default function*() {
  yield* L.focus(adapter(openai("gpt-4o-mini")))
  yield* L.system`
    You are a helpful assistant that tells dad jokes.
    When asked a question, respond to the best of your ability
    without asking for clarification.
  `
  yield* L.user`Please tell me some goofy dad jokes.`
  yield* L.assistant
  let i = 0
  while (i < 10) {
    yield* L.user`Another please`
    yield* L.assistant
    i++
  }
}
