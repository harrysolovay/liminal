# Liminal Threads <Badge type="warning" text="beta" />

## `Thread` Overview

A thread is a container of several properties:

1. A option of a system instruction.
2. A list of model-agnostic messages. The messages can be of varying role and
   content part types.
3. A set of enabled tool kits with which the model can perform tool-calling.
4. A pubsub with which we can subscribe to conversation events such as
   messaging.

## `L.thread`

`L.thread` isolates the target effect with a new thread containing an empty
message list and no system instruction nor tools.

```ts twoslash
import { Effect } from "effect"
import L from "liminal"
declare const conversation: Effect.Effect<void>
// ---cut---
L.thread(conversation)
```

## `L.branch`

`L.branch` isolates the target effect with a new thread containing a copy of
parent's messages, tools and system instruction.

```ts twoslash
import { Effect } from "effect"
import L from "liminal"
declare const conversation: Effect.Effect<void>
// ---cut---
Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant

  yield* conversation.pipe(L.branch)
})
```
