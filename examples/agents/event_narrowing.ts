import { type } from "arktype"
import "liminal-arktype/register"
import { Agent, EventBase, L, LEvent } from "liminal"
import { gpt4oMini } from "./models.ts"

const SomethingTag = Symbol()
class Something extends EventBase(SomethingTag, "something") {}

await Agent(g, {
  handler(event) {
    console.log({ event })
    if (LEvent.is(event)) {
      event satisfies LEvent
    } else if (Something.is(event)) {
      event satisfies Something
    } else {
      event satisfies string
    }
  },
})

function* g() {
  yield* L.model(gpt4oMini)
  yield* L.user`Tell me a joke.`
  yield* L.assistant
  yield* L.emit("event-root")
  yield* L.branch(function*() {
    yield* L.emit("event-a")
    yield* L.branch(function*() {
      yield* L.assistant(type({
        something: "string",
      }))
      yield* L.emit("event-b")
      yield* L.branch(function*() {
        yield* L.emit(new Something())
      })
      return g
    })
    yield* L.emit("another-event")
    yield* L.branch(function*() {
      yield* L.emit("event-e")
      yield* L.branch(function*() {})
      return "hello"
    })
    yield* L.emit(new Something())
    yield* L.emit("event-f")
    yield* L.branch(function*() {
      yield* L.emit("event-g")
    })
  })
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.assistant
}
