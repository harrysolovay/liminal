# Segments

A core tenet of Liminal is to never directly manipulate message lists.
Additionally, we try to avoid direct message retrieval. It is difficult to
reason about message lists. Meanwhile, it's easy to reason about discrete
moments within a conversation.

However, we need a way of tracking, visiting and manipulating moments and
regions of our conversation. Enter: **Segments**.

## Segments Overview

Let's say we're building an agent to coordinate a game of Dungeons and Dragons.
The agent may want to segment messages by player.

```ts
declare const allie: Segment
declare const billy: Segment
declare const carol: Segment
```

Whenever our agent needs to make a decision about a given player, it can create
a child agent that solely contains messages from the given player's segment. For
example:

```ts
function* g() {
  yield* allie(function*() {
    // This scope solely contains messages from the `allie` segment.
  })
}
```

We can also clear the conversation of all messages of the given segment. For
example, if the player "Allie" violates the agent's code of conduct, it can
remove all messages of the `allie` segment.

```ts
function* g() {
  yield* allie.clear()
}
```

## Creating Segments

### Marks

Marks are references to specific points in the agent's conversation.

```ts
function* g() {
  yield* L.user`First message.`

  const start = yield* L.mark

  yield* L.user`Second message.`

  const end = yield* L.mark

  yield* L.user`Third message.`
}
```

#### Mark Ranges

Any two marks can be used to create a segment.

```ts
const segment = start.to(end)
```

The direction does not matter. Either of the following will produce semantically
identical segments. In the following example, `a` and `b` represent the same
segment.

```ts
const a = start.to(end)
const b = end.to(start)
```

Every mark has a `leading` and `trailing` property, both of which are segments.

```ts
function* g() {
  yield* L.user`A`

  const mid = yield* L.mark
  const { leading, trailing } = mid

  yield* L.user`B`
}
```

### Tags

#### Creating Tags

We may not want to select a discrete slice of the conversation, but rather tag
specific, possibly-discontinuous messages.

Tag creation has no effect on the agent's state and can occur outside the agent
source.

```ts
const myTag = L.tag("Optional description here.")
```

#### Tagging Messages

Within the agent source, we can tag specific messages like so:

```ts
function* g() {
  yield* L.user`Message A`.tag(myTag)
}
```

The `tag` method can accept multiple tags.

```ts
function* g() {
  yield* L.user`Message A`.tag(tagA, tagB, tagC)
}
```

#### Creating Tag Segments

The creation of segments also has no effect on the agent's state, so we can
define it outside the agent source.

```ts
const segment = L.segment(tagA, tagB, tagC)
```

### "Supersegments"

Segments can be composed into supersets or "supersegments."

```ts
const abc = L.segment(
  segmentA,
  segmentB,
  segmentC,
)
```

## Mark Range Example

To sum up this chapter, let's look at the following example in which we use
marks to denote (and ultimately clear messages between) the start and end of an
iterative refinement loop.

```ts
function* g() {
  const requirementsStart = yield* L.mark

  let requirements = prompt("Please describe the initial requirements")!
  yield* L
    .system`Your job is to assist me in refining the following requirements.`
  yield* L.user`Here are the initial requirements.`
  while (true) {
    yield* L.user`Latest requirements: ${requirements}`
    yield* L.user`Is there anything that I should clarify? If so, what?`
    const clarifyingQuestion = yield* L.reply(
      L.option(L.string`The clarifying question.`),
    )
    if (!clarifyingQuestion) break
    const clarification = prompt(clarifyingQuestion)
    yield* L
      .user`Please update the requirements description with the following clarification: ${clarification}`
    requirements = yield* L.reply
  }

  const requirementsEnd = yield* L.mark

  // ...
}
```

Once the refinement loop breaks, `requirements` will contain the optimized set
of requirements. Our agent no longer necessarily benefits from having all of
those messages related to requirement clarification. Moreover, the initial
`system` message no longer applies. We can clear out the unwanted messages like
so:

```ts
function* g() {
  // ...

  yield* requirementsStart.to(requirementsEnd).clear()
}
```
