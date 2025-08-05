# Liminal Strands <Badge type="warning" text="beta" />

## `Strand` Overview

A strand is a container for a conversation. Each strand tracks a few properties:

1. A option of a system instruction.
2. A list of model-agnostic messages. The messages can be of varying role and
   content part types.
3. A set of enabled tool kits with which the model can perform tool-calling.
4. A pubsub with which we can subscribe to conversation events such as
   messaging.

## `L.strand`

`L.strand` isolates the target effect with a new strand containing an empty
message list and no system instruction nor tools.

```ts twoslash
import { Effect } from "effect"
import { L } from "liminal"
declare const conversation: Effect.Effect<void>
// ---cut---
L.strand(conversation)
```

## `L.branch`

`L.branch` isolates the target effect with a new strand containing a copy of
current strand's messages, tools and system.

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

## `Strand.layer`

In the case that you wish to manually create and provide a strand, you can do so
as follows.

<<< @/_blocks/StrandLive.ts
