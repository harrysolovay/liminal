import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import * as L from "liminal"
import { AILanguageModel } from "liminal-ai"

L.exec(PlanTrip("New York City"), {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
  },
  handler: console.log,
})

function* PlanTrip(departureLocation: string) {
  yield* L.declareLanguageModel("default")
  yield* L.user`
    I want to plan a weekend trip leaving from ${departureLocation}. I don't know where to go.
    Suggest some follow-up questions that will help you narrow down the possible destination.
  `
  const questions = yield* L.infer(type.string.array())
  yield* L.user`Here are my answers to those questions:`
  for (const question of questions) {
    yield* L.user`
      Question: ${question}
      Answer: ${prompt(question)!}
    `
  }
  yield* L.user`Now that we've refined the destination criteria, please provide a single recommendation.`
  const result = yield* L.infer()
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.infer()
}
