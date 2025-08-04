# Liminal Messages <Badge type="warning" text="beta" />

## Effect AI `Message` Format

Liminal represents messages using Effect AI's provider-agnostic `Message`
schema.

```ts
import { Message } from "@effect/ai/AiInput"

Message
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />

## `L.messages`

To access the messages of the strand, use `L.messages`.

```ts
import { Effect } from "effect"
import { L } from "liminal"
// ---cut---
Effect.gen(function*() {
  const messages = yield* L.messages
  //    ^?
})
```

## Serde

We can use the Message schema to encode, persist and decode messages. This
encoding/decoding handles various message part types, including images and file
parts.

<<< @/_blocks/message_e2e.ts

## `L.user`

Append a user message to the current strand's message list.

```ts
import { Effect, Schema } from "effect"
import { L } from "liminal"

// ---cut---
Effect.gen(function*() {
  // As a tagged template function call.
  yield* L.user`...`

  // As an ordinary function call.
  yield* L.user("...")
})
```

## `L.userJson`

Append the stringified JSON-serializable value to the current strand's messages.
Optionally provide a schema, the annotations of which will be added as JSONC
comments to the resulting JSON string contained within the new message.

```ts
import { Effect, Schema } from "effect"
import { L } from "liminal"

Effect.gen(function*() {
  yield* L.userJson({
    outer: {
      inner: "value",
    },
  })
})
```

## `L.assistant`

Infer a message from the model and append it to the current strand's message
list.

```ts {4}
import { Effect, Schema } from "effect"
import { L } from "liminal"

// ---cut---
Effect.gen(function*() {
  yield* L.user`...`

  const reply = yield* L.assistant

  reply satisfies string
})
```

## `L.assistantStruct`

Use Effect Schema to describe structured output requirements.

### Providing Field Schemas

```ts {4-7}
import { Effect, Schema } from "effect"
import { L } from "liminal"
// ---cut---
Effect.gen(function*() {
  yield* L.user`When is halloween?`

  const result = yield* L.assistantStruct({
    month: Schema.Int,
    day: Schema.Int,
  })

  result satisfies { month: number; day: number }
})
```

### Providing Schemas

```ts {1-4,9} twoslash
import { Effect, Schema } from "effect"
import { L } from "liminal"
// ---cut---
const MonthDay = Schema.Struct({
  month: Schema.Int,
  day: Schema.Int,
})

Effect.gen(function*() {
  yield* L.user`When is halloween?`

  const result = yield* L.assistantStruct(MonthDay)

  result satisfies { month: number; day: number }
})
```

## `L.clear`

Clear the current strand's list of messages.

```ts
import { Effect } from "effect"
import { L } from "liminal"
declare const assertEquals: (a: unknown, b: unknown) => void
// ---cut---
Effect.gen(function*() {
  // Initial messages.
  yield* L.user`A`
  yield* L.user`B`
  yield* L.user`C`

  // Clear the messages.
  yield* L.clear

  // The strand's message list is now empty.
  const messages = yield* L.messages
  assertEquals(messages, [])
})
```

## `L.append`

Append raw Effect AI messages to strand's message list.

<<< @/_blocks/raw_append.ts
