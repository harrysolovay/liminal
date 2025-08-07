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

```ts {5-9}
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

We can optionally pass a schema with description annotations, which will then be
used to JSONC-encode the JSON with descriptions about corresponding values.

```ts
import { Array, Console, Effect, Schema } from "effect"
import { L, LPretty } from "liminal"

const ExampleSchema = Schema.Struct({
  inner: Schema.String.pipe(
    Schema.annotations({
      description: "Some description for the LLM.",
    }),
  ),
})

Effect.gen(function*() {
  yield* L.userJson({ inner: "value" }, ExampleSchema)
})
```

The resulting message looks as follows.

````txt
```jsonc
{
  // Some description for the LLM.
  inner: "value"
}
```
````

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

## `L.assistantSchema`

Use Effect Schema to describe structured output requirements.

### Providing Schemas

```ts {4} twoslash
import { Effect, Schema } from "effect"
import { L } from "liminal"
// ---cut---
Effect.gen(function*() {
  yield* L.user`Is Halloween the best holiday?`

  const result = yield* L.assistantSchema(Schema.Boolean)

  result satisfies boolean
})
```

We could of course also provide more complex structures, such as structs.

```ts {4-9} twoslash
import { Effect, Schema } from "effect"
import { L } from "liminal"

// ---cut---
Effect.gen(function*() {
  yield* L.user`When is halloween?`

  const result = yield* L.assistantSchema(
    Schema.Struct({
      month: Schema.Int,
      day: Schema.Int,
    }),
  )

  result satisfies {
    month: number
    day: number
  }
})
```

### Providing Field Schemas

In the case of providing structs inline, we can skip the outer `Schema.Struct`
wrapping, and directly pass the fields.

```ts {4-7}
import { Effect, Schema } from "effect"
import { L } from "liminal"
// ---cut---
Effect.gen(function*() {
  yield* L.user`When is halloween?`

  const result = yield* L.assistantSchema({
    month: Schema.Int,
    day: Schema.Int,
  })

  result satisfies { month: number; day: number }
})
```

## `L.clear`

Clear the current strand's list of messages.

```ts {11}
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

<<< @/_blocks/raw_append.ts {7,10-16}
