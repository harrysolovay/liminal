import { type } from "arktype"
import { Agent, L } from "liminal"
import { fromArktype } from "liminal-arktype"

await Agent(g, {
  handler(_event) {
  },
})

export default function* g() {
  yield* L.user`Tell me a joke.`
  yield* L.assistant
  yield* L.event("event-root")
  yield* L.branch(function*() {
    yield* L.event("event-a")
    const v = L.branch(function*() {
      const g = yield* L.assistant(fromArktype(type({
        something: "string",
      })))
      yield* L.event("event-b")
      yield* L.branch(function*() {
        yield* L.event(new Something())
      })
      return g
    })
    yield* L.event("another-event")
    yield* L.branch(function*() {
      yield* L.event("event-e")
      yield* L.branch(function*() {})
      return "hello"
    })
    yield* L.event("event-f")
    yield* L.event("event-f")
    yield* L.branch(function*() {
      yield* L.event("event-g")
    })
  })
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.assistant
}

class Something {}
