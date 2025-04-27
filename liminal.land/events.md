# Liminal Events <Badge type="warning" text="beta" />

```ts
function* g() {
  yield* L.event("my-event")
}
```

```ts
await L.strand(g, {
  handler(event) {
    if (event === "my-event") {
      // ...
    }
  },
})
```

```ts
const YourProgramKey = Symbol.for("<your-program-name>/AppTag")
export class MyEvent extends EventBase(YourProgramKey, "my_event") {}

await L.strand(
  function*() {
    yield* L.event(new AppEvent())
  },
  {
    handler(event) {
      if (MyEvent.is(event)) {
        // ...
      }
    },
  },
)
```

```ts
await L.event(g, {
  handler(event) {
    if (event.type === "a") {
      event.value satisfies string
    } else if (event.type === "b") {
      event.value satisfies number
    } else {
      event.value satisfies never
    }
  },
})
```
