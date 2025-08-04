---
prev: false
---

# Liminal Overview <Badge type="warning" text="beta" />

**Liminal enables the expression of reusable conversations as
[effects](/effects.md).**

<<< @/_blocks/a_taste.ts

## State Management

We `yield*` Liminal effects to manage the underlying conversation state. The
final conversation of the previous example may look as follows.

```json
[
  {
    "role": "system",
    "content": "You are a Leprechaun."
  },
  {
    "role": "user",
    "content": "Where is the pot of gold?"
  },
  {
    "role": "assistant",
    "content": "Under the rainbow."
  }
]
```

## Unifying Conversation and Control Flow

We reason about the progression of the conversation as one with ordinary
function control flow. We can utilize ordinary control flow operators, such as
`for` and `while` loops .

<<< @/_blocks/while_looping.ts

## Reusable Patterns

We can compose patterns that abstract over the low-level back-and-forth of
user-assistant messaging. Conversations become our units of composition; we no
longer think solely in terms of messages.

For example, we can express a reusable iterative refinement conversation pattern
as follows.

`refine.ts`

<<< @/_blocks/refine.ts

We can then share and consume this pattern––or any Liminal effect––as we would
any other TypeScript file or library.

`refine_consumer.ts`

<<< @/_blocks/refine_consumer.ts

## Branching

Liminal provides mechanisms for branching conversations so that we can easily
explore alternative outcomes from any given state.

In the following example, the `Rap`, `Rock` and `Pop` branches all inherit an
isolated copy of the parent's messages, which contain the initial user message.

<<< @/_blocks/song_branches.ts

---

In the next section we cover Liminal's installation and a basic example of its
usage.
