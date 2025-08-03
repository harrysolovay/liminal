# Liminal Strands <Badge type="warning" text="beta" />

## `Strand` Overview

A strand is a container for a conversation. Each strand tracks a few properties:

1. A system prompt or lack thereof.
2. A list of model-agnostic messages. The messages can be of varying role and
   content types.
3. A set of tools with which the model can perform tool-calling.
4. A pubsub with which we can subscribe to conversation events such as the
   appending of a new message.

## `Strand.new`

`Strand.new` produces a layer, which provides a strand with an empty list of
messages and no tools.

```ts twoslash
import { Effect } from "effect"
import { Strand } from "liminal"
declare const conversation: Effect.Effect<void>
// ---cut---
conversation.pipe(
  Effect.provide(
    Strand.new`You are a helpful assistant...`,
  ),
)
```

It is overloaded to accept a system prompt through tagged template or ordinary
function call.

```ts
Strand.new()
Strand.new`System prompt`
Strand.new("System prompt")
```

## `Strand.clone`

`Strand.clone` produces a layer, which provides a strand containing a clone of
current strand's messages, tools and system unless otherwise specified.

```ts twoslash
import { Effect } from "effect"
import { L, Strand } from "liminal"
declare const conversation: Effect.Effect<void>
// ---cut---
Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant

  yield* conversation.pipe(
    Effect.provide(
      Strand.clone(),
    ),
  )
})
```

`Strand.clone` is overloaded similarly to `Strand.new`.

```ts
Strand.clone()
Strand.clone`System prompt`
Strand.clone("System prompt")
```

## `Strand.make`
