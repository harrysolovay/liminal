import { Exec, isWithinScope, isWithinSubscope, L } from "liminal"

const exec = Exec(g, {
  default: null!,
})

exec((event) => {
  if (event.type === "emitted" && event.key === "event-f") {
    event.scope
  }
  if (isWithinScope(event, [L._, L._])) {
    event.scope
  }
  if (isWithinSubscope(event, ["child-a", L._, "f"])) {
    event.scope
  }
})

export default function* g() {
  yield* L.user`Tell me a joke.`
  yield* L.assistant`Tell me a joke.`
  yield* L.infer()
  yield* L.emit("event-root")
  yield* L.branch("child-a", function*() {
    yield* L.emit("event-a")
    yield* L.branch("child-b", function*() {
      const g = yield* L.object({
        something: L.string,
      })
      yield* L.emit("event-b")
      yield* L.branch("child-c", function*() {
        yield* L.emit("event-c")
      })
      return g
    })
    yield* L.emit("another-event")
    yield* L.branch("child-d", {
      *e() {
        yield* L.emit("event-e")
        yield* L.branch("child-e", function*() {})
        return "hello"
      },
      *f() {
        yield* L.embed("something")
        yield* L.emit("event-f")
        yield* L.branch("child-g", function*() {
          yield* L.emit("event-g")
        })
      },
    })
  })
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.infer()
}
