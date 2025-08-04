# Liminal Strands <Badge type="warning" text="beta" />

## `Strand` Overview

A strand is a container for a conversation. Each strand tracks a few properties:

1. A system prompt or lack thereof.
2. A list of model-agnostic messages. The messages can be of varying role and
   content types.
3. A set of tools with which the model can perform tool-calling.
4. A pubsub with which we can subscribe to conversation events such as the
   appending of a new message.

## `L.strand`

`L.strand` produces a layer, which provides a strand with an empty list of
messages and no tools.

```ts twoslash
import { Effect } from "effect"
import { L } from "liminal"
declare const conversation: Effect.Effect<void>
// ---cut---
L.strand(conversation)
```

## `L.branch`

`L.branch` produces a layer, which provides a strand containing a clone of
current strand's messages, tools and system unless otherwise specified.

```ts twoslash
import { Effect } from "effect"
import { L, Strand } from "liminal"
declare const conversation: Effect.Effect<void>
// ---cut---
Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant

  yield* conversation.pipe(L.branch)
})
```

## `Strand.make`

In the unusual case that you wish to manually create and provide a strand, you
can do so as follows.

<<< @/_blocks/StrandLive.ts
