import { EventBase, L } from "liminal"
import { adapter } from "liminal-ollama"

const g = Symbol()
class MyEvent extends EventBase(g, "MyEvent") {}

await L.strand(function*() {
  yield* L.model(adapter("gemma3:1b"))
  yield* L.system`
      When an instruction is given, don't ask any follow-up questions.
      Just reply to the best of your ability given the information you have.
    `
  yield* L.user`Decide on a subtopic for us to discuss within the domain of technological futurism.`
  yield* L.assistant
  yield* L.user`Great, please teach something interesting about this choice of subtopic.`
  yield* L.assistant
  yield* L.event(new MyEvent())
  let i = 0
  while (i < 3) {
    const reply = yield* L.strand(function*() {
      yield* L.user`Please reply to the last message on my behalf.`
      return yield* L.assistant
    })
    yield* L.user(reply)
    yield* L.assistant
    i++
  }
  yield* L.user`Please summarize the key points from our conversation.`
  return yield* L.assistant
}, { handler: console.log })
