import { openai } from "@ai-sdk/openai"
import { exec, L } from "liminal"
import { AILanguageModel } from "liminal-ai"

const { result } = await exec(g, {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
  },
})

console.log(result)

function* g() {
  yield* L.declareLanguageModel("default")
  yield* L.user`Lorem.`
  yield* L.user`Ipsum.`
  yield* L.string
  const before = yield* L.getMessages()
  yield* L.setMessages((_messages) => [])
  const after = yield* L.getMessages()
  return { before, after }
}
