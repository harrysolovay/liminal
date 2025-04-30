import { type } from "arktype"
import { L } from "liminal"
import { compile } from "liminal-arktype"
import { gpt4oMini } from "./_models.ts"

const DEPARTURE_LOCATION = "New York City"

await L.run(
  function*() {
    yield* L.model(gpt4oMini)
    yield* L.user`
      I want to plan a weekend trip leaving from ${DEPARTURE_LOCATION}. I don't know where to go.
      Suggest some follow-up questions that will help you narrow down the possible destination.
    `
    const questions = yield* L.assistant(compile(type.string.array()))
    yield* L.user`Here are my answers to those questions:`
    for (const question of questions) {
      yield* L.user`
        Question: ${question}
        Answer: ${prompt(question)!}
      `
    }
    yield* L.user`Now that we've refined the destination criteria, please provide a single recommendation.`
    yield* L.assistant
    yield* L.user`Where can I stay there, what can I do there, how do I get there?`
    return yield* L.assistant
  },
  { handler: console.log },
)
