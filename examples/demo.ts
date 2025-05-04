import { L } from "liminal"
import { gpt4oMini } from "./_common.ts"

await L.run(
  async function*() {
    yield* L.focus(gpt4oMini)
    yield* L.system`
      You are a helpful travel agent. Your job is to help the customer refine their travel plans by asking clarifying questions and then providing a detailed travel plan based on their requirements.
    `
    // Get initial requirements from the user (human input)
    const requirements = prompt("What are your travel requirements? (e.g., destination, dates, budget, interests)")!
    yield* L.user`Here are my travel requirements: ${requirements}`

    // Ask the model for follow-up questions to clarify the requirements
    yield* L.user`What follow-up questions would you ask to clarify my travel requirements?`
    const questions = yield* L.assistant(L.array(L.string))

    // For each follow-up question, get the user's answer and add it to the conversation
    for (const question of questions) {
      const answer = prompt(question)!
      yield* L.user`
        Question: ${question}
        Answer: ${answer}
      `
    }

    // Ask the model to provide a refined travel plan
    yield* L.user`Based on my answers, please provide a detailed travel plan recommendation.`
    const plan = yield* L.assistant

    // Optionally, ask for further details or refinements
    // yield* L.user`Can you suggest activities, accommodations, and transportation options for this plan?`
    // const details = yield* L.assistant

    // Optionally emit an event
    // yield* L.emit(new TravelPlanFinalized())

    return plan
  },
  { handler: console.log },
)
