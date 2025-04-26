import { L } from "liminal"
import { adapter } from "liminal-ollama"

await L.strand(
  function*() {
    // Kick off the conversation.
    yield* L.model(adapter("gemma3:1b"))
    yield* L.user`Decide on a topic for us to discuss.`
    yield* L.assistant

    // Loop through some conversation turns.
    let i = 0
    while (i++ < 3) {
      // Have the language model respond to itself in an isolated copy of the current "strand."
      const reply = yield* L.strand(function*() {
        yield* L.user`Please reply to the last message on my behalf.`
        return yield* L.assistant
      })

      // Use the child strand's return value to append a user message within the root "strand."
      yield* L.user(reply)
      yield* L.assistant
    }

    yield* L.user`Summarize key points from our conversation.`
    return yield* L.assistant
  },
  { handler: console.log },
)
