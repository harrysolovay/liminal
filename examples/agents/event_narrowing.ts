import { exec, isScopeChildEvent, isScopeDescendantEvent, L } from "liminal"

await exec(g, {
  default: null!,
  handler(event) {
    if (isScopeChildEvent(event, ["child-a", "child-b", "child-c"])) {
      event
    }
    if (isScopeChildEvent(event, ["child-a", "child-d", "f"])) {
      if (event.type === "returned") {
        event.value
      }
    }
    if (isScopeChildEvent(event, ["child-a", "child-b", "child-c"])) {
      if (event.type === "emitted") {
        event.value
      }
    }
    if (isScopeChildEvent(event, [])) {
      event.type // no `branched`
      if (event.type === "returned") {
        event.value
      }
    }
    if (event.type === "emitted") {
      event.value
    }
    if (isScopeChildEvent(event, ["child-a", "child-d", "f", "child-g"])) {
      if (event.type === "emitted") {
        event
      }
    }
    if (isScopeChildEvent(event, [L._, L._])) {
      event.scope
    }
    if (isScopeDescendantEvent(event, ["child-a", L._, "f"])) {
      event.scope
    }
    if (isScopeDescendantEvent(event, ["child-a", "child-d"])) {
      event.scope
    }
    if (isScopeChildEvent(event, ["child-a", "child-d", "e"])) {
      if (event.type === "returned") {
        event.value
      }
    }
  },
})

export default function* g() {
  yield* L.user`Tell me a joke.`
  yield* L.assistant`Tell me a joke.`
  yield* L.infer
  yield* L.emit("event-root")
  yield* L.branch("child-a", function*() {
    yield* L.emit("event-a")
    yield* L.branch("child-b", function*() {
      const g = yield* L.object({
        something: L.string,
      })
      yield* L.emit("event-b")
      yield* L.branch("child-c", function*() {
        yield* L.emit({
          some: {
            data: "HERE",
          },
        })
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
          yield* L.emit({
            another: "event-g",
          })
        })
      },
    })
  })
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.infer
}
