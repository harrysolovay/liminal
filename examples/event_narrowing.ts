import { EventBase, L, LEvent } from "liminal"
import { gpt4oMini } from "./_models.ts"

const SomethingTag = Symbol()
class Something extends EventBase(SomethingTag, "something") {}

await L.run(g, {
  handler(event) {
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
  yield* L.strand(function*() {
    yield* L.emit("event-a")
    yield* L.strand(function*() {
      yield* L.assistant(L.object({
        something: L.string,
      }))
      yield* L.emit("event-b")
      yield* L.strand(function*() {
        yield* L.emit(new Something())
      })
      return g
    })
    yield* L.emit("another-event")
    yield* L.strand(function*() {
      yield* L.emit("event-e")
      yield* L.strand(function*() {})
      return "hello"
    })
    yield* L.emit(new Something())
    yield* L.emit("event-f")
    yield* L.strand(function*() {
      yield* L.emit("event-g")
    })
  })
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.assistant
}
