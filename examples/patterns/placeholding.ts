import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { declareLanguageModel, exec, infer, user } from "liminal"
import { AILanguageModel } from "liminal-ai"

const departure = Symbol()

exec(PlanTrip, {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
    // [departure]: "New York City",
  },
  handler: console.log,
})

function* PlanTrip() {
  yield* declareLanguageModel("default")
  yield* user`
    I want to plan a weekend trip leaving from ${departure}. I don't know where to go.
    Suggest some follow-up questions that will help you narrow down the possible destination.
  `
  const questions = yield* infer(type.string.array())
  yield* user`Here are my answers to those questions:`
  for (const question of questions) {
    yield* user`
      Question: ${question}
      Answer: ${prompt(question)!}
    `
  }
  yield* user`Now that we've refined the destination criteria, please provide a single recommendation.`
  const result = yield* infer()
  yield* user`Where can I stay there, what can I do there, how do I get there?`
  return yield* infer()
}
