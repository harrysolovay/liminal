import { type ActorLike, Exec, type ExtractEventScope, L } from "liminal"

type g = typeof g extends ActorLike<infer Y> ? Y[""] : never

type f = ExtractEventScope<g>

const exec = Exec(g, {
  default: null!,
})

exec((event) => {
  event
})

export default function* g() {
  yield* L.user`Tell me a joke.`
  yield* L.assistant`Tell me a joke.`
  yield* L.infer()
  yield* L.emit("event-root")
  yield* L.branch("child-a", function*() {
    yield* L.emit("event-a")
    yield* L.branch("child-b", function*() {
      yield* L.emit("event-b")
      yield* L.branch("child-c", function*() {
        yield* L.emit("event-c")
      })
    })
    yield* L.emit("another-event")
    yield* L.branch("child-d", {
      *e() {
        yield* L.emit("event-e")
        yield* L.branch("child-e", function*() {})
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
