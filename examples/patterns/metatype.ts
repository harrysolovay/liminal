import { openai } from "@ai-sdk/openai"
import { exec, L } from "liminal"
import { AILanguageModel } from "liminal-ai"

await exec(g, {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini", {
      structuredOutputs: true,
    })),
  },
  handler: console.log,
})

function* g() {
  yield* L.declareLanguageModel("default")
  yield* L.user`
    I need a type that represents the data of a fantastical story world
    full of super-powered beings such as witches, vampires, werewolves and fae.
    Prefer producing complex object types.
  `
  const WorldType = yield* L.metatype
  return yield* WorldType
}
