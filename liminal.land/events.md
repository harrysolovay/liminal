# Liminal Events <Badge type="warning" text="beta" />

Yield events from your conversation definition.

```ts
function* g() {
  yield* L.event("my-event")
}
```

When turning this definition into a strand, we can add an event handler.

```ts
await L.strand(g, {
  handler(event) {
    if (event === "my-event") {
      // ...
    }
  },
})
```

## Extract Static Event Type

```ts twoslash
import { Definition, L } from "liminal"

function* g() {
  yield* L.emit("A")
  yield* L.emit(["B"])
  yield* L.emit({ c: "D" })
}

type GEvent = Definition.E<typeof g>
//   ^?
```

<br />
<br />
<br />

## Custom Event Helper

Yielding plain string literals may not scale well. Instead, you can use
`EventBase` to create custom event type factories and guards.

1. Create a unique symbol for your project

```ts
const CustomEventTag = Symbol.for("<your-project-name>/CustomEventTag")
```

2. Create the event constructor.

```ts
import { EventBase } from "liminal"

class MyEvent extends EventBase(YourProgramKey, "my_event") {}
```

3. Yield instances of the event from within your conversation definition.

```ts {2}
function* g() {
  yield* L.event(new MyEvent())
}
```

4. Use the static `is` method of the custom event class.

```ts {7}
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
