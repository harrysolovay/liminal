# Segments

A core tenet of Liminal is to never directly read or mutate the message list
underlying an agent. When working with agent hierarchies—each agent with its own
list of messages—it becomes increasingly difficult to reason about message
lists. Instead, we reason about _segments_, which group messages into meaningful
units as required by the use case.

## Brief Example

Suppose we're building an agent to coordinate a game of Dungeons and Dragons.
The agent may want to segment messages by player:

```ts
declare const allie: Segment
declare const billy: Segment
declare const carol: Segment
```

Whenever our agent needs to make a decision about a specific player, it can
create a child agent that contains only the messages from that player's segment:

```ts
function* g() {
  yield* allie(function*() {
    // This scope solely contains messages from the `allie` segment.
  })
}
```

Segments also give us a means of manipulating the message list underlying the
agent. For example, if the player "Allie" violates the agent's code of conduct,
the agent may choose to remove her from the game and clear all messages
associated with the `allie` segment:

```ts
function* g() {
  yield* allie.clear()
}
```

## Creating Segments

### Marks

Marks are references to specific points in the agent's conversation:

```ts
function* g() {
  yield* L.user`First message.`

  const start = yield* L.mark

  yield* L.user`Second message.`

  const end = yield* L.mark

  yield* L.user`Third message.`
}
```

#### Range Segments

Any two marks can define a segment that includes all messages between them:

```ts
const segment = start.to(end)
```

The direction of chronology does not matter:

```ts
const a = start.to(end)
const b = end.to(start) // a and b represent the same segment
```

Each mark includes its `leading` and `trailing` segments:

```ts
function* g() {
  yield* L.user`A`
  const mid = yield* L.mark
  const {
    leading, // Includes all messages before `mid`.
    trailing, // Includes all messages after `mid`.
  } = mid
  yield* L.user`B`
}
```

### Tags

While marks create segments from contiguous ranges of messages, tags allow the
grouping of discontinuous messages.

```ts
const myTag = L.tag("Optional description here.")
```

> [!TIP]
> Tag creation does not affect agent state and can occur outside the agent
> source. This enables us to––for instance––centralize all tags in a `tag.ts`
> file.

#### Tagging Messages

Within the agent source, tag specific messages like so:

```ts
// Apply a single tag.
function* g() {
  yield* L.user`Message A`.tag(myTag)
}

// Apply multiple tags.
function* g() {
  yield* L.user`Message B`.tag(tagA, tagB, tagC)
}

// Conditionally apply a tag.
function* g() {
  yield* L.user`Message C`.tag(condition && myTag)
}
```

#### Tag Segments

Tags are themselves segments and can be directly yielded.

```ts
function* g() {
  yield* myTag(function*() {
    // Agent solely contains `myTag` messages.
  })
}
```

We can combine tags and segments into new segments using `L.union`.

```ts
const union = L.union(myTag, mySegment, ...more)
```

When resolved at runtime, the union's messages will be ordered chronologically,
regardless of the order in which the tags or segments are provided.

We can create a segment that describes the intersection of segments or tags.

```ts
const intersection = L.intersect(myTag, mySegment, ...more)
```

We can create a segment that describes the subtraction of a set of tags or
segments from a target segment.

The following gives us a new segment representing messages in `segmentA` but not
in `tagA` nor `segmentB`.

```ts
const difference = segmentA.subtract(tagA, segmentB)
```

For the symmetric difference, we can use the `L.difference` factory as follows.

```ts
const ab = L.difference(abc, myTag)
```

## Closing Example

Consider an agent using marks to encapsulate a refinement loop:

```ts
function* g() {
  const requirementsStart = yield* L.mark

  let requirements = prompt("Please describe the initial requirements")
  yield* L
    .system`Your job is to assist me in refining the following requirements.`

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

Once the loop exits, the agent can clear all messages from the refinement phase:

```ts
function* g() {
  // ...

  yield* requirementsStart.to(requirementsEnd).clear()
}
```

This helps ensure the agent's state remains relevant and uncluttered.
Additionally, it removes the system message that applied solely to the
refinement phase.
