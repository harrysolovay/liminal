import { type } from "arktype"
import "liminal-arktype/register"
import { EventBase, L, LEvent } from "liminal"
import { gpt4oMini } from "./_models.ts"

const SomethingTag = Symbol()
class Something extends EventBase(SomethingTag, "something") {}

await L.strand(g, {
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
  yield* L.event("event-root")
  yield* L.strand(function*() {
    yield* L.event("event-a")
    yield* L.strand(function*() {
      yield* L.assistant(type({
        something: "string",
      }))
      yield* L.event("event-b")
      yield* L.strand(function*() {
        yield* L.event(new Something())
      })
      return g
    })
    yield* L.event("another-event")
    yield* L.strand(function*() {
      yield* L.event("event-e")
      yield* L.strand(function*() {})
      return "hello"
    })
    yield* L.event(new Something())
    yield* L.event("event-f")
    yield* L.strand(function*() {
      yield* L.event("event-g")
    })
  })
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.assistant
}
