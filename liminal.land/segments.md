# Segments

A core tenet of Liminal is to never directly manipulate message lists. We even
try to avoid direct message retrieval. When working with agent hierarchies, each
with their own list of messages, it becomes increasingly difficult to reason
about lists of messages. Meanwhile, it's easy to reason about discrete moments
within a conversation.

All this being said, we need a way to track, visit and manipulate moments and
regions of our conversation. Enter: **Segments**.

## Example Use Case

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

The segment also gives us a means of manipulating the message list underlying
the agent.

For example: if the player "Allie" violates the agent's code of conduct, it may
choose to remove her from the game and clear itself of all messages of the
`allie` segment.

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

We can use any two marks to create a segment that describes all messages between
them.

```ts
const segment = start.to(end)
```

The chronology direction does not matter. In the following example, `a` and `b`
represent the same segment.

```ts
const a = start.to(end)
const b = end.to(start)
```

Every mark has a `leading` and `trailing` property, both of which are segments
describing all leading and trailing messages respectively.

```ts
function* g() {
  yield* L.user`A`

  const mid = yield* L.mark
  const { leading, trailing } = mid

  yield* L.user`B`
}
```

### Tags

While marks allow us to create segments from discrete slices of the
conversation, tags allow us to create segments from discontinuous messages.

#### Creating Tags

Tag creation has no effect on the agent's state; it can occur outside the agent
source. This makes it easy to centralize tags in a single file such as a
`tags.ts`.

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
  yield* L.user`Message B`.tag(tagA, tagB, tagC)
}
```

It can also accept falsy values, incase you want to conditionally tag a message.

```ts
declare const condition: boolean

function* g() {
  yield* L.user`Message C`.tag(condition && myTag)
}
```

#### Tag Segments

The creation of segments also has no effect on the agent's state, so we can
define it outside the agent source.

```ts
const segment = L.segment(tagA, tagB, tagC)
```

### "Supersegments"

Segments can be composed into supersets like so:

```ts
const abc = L.segment(
  segmentA,
  segmentB,
  segmentC,
)
```

## Closing Example

Let's look at the following example in which we use marks to denote (and
ultimately clear messages between) the start and end of a refinement loop.

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
