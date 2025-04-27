# Liminal Messages <Badge type="warning" text="beta" />

Whenever we interact with a language model, we send along a list of messages.
These messages are context with which the language model forms a reply.

The language model is your creative writing partner. It writes the next passage
(message) of the story.

## Message Roles

Most model providers separate messages into three roles: _system_, _user_ and
_assistant_.

### _System_

The system role often implies important or unbreakable directives to which any
reply need closely adhere. We can use it to restrict model replies. For example:

> "Never ask follow-up questions. Always use the information you have to reply
> to the best of your ability."

### _User_

The user role may imply the message is extrinsic (for instance from an end user
or another language model). The language model considers these messages to be
from the "other" participant in the conversation. For example:

> "Provide me with a suggestion for a thoughtful birthday gift for my mom. Price
> range between $10 and $50."

### _Assistant_

Assistant messages are typically produced by the language model. However, they
can also be used to give the language model a sense of "self" or to seed its
replies.[^1] A language model might reply to the previous user message as
follows:

> "You could purchase a frame and place a photo of the two of you inside.

## Appending Messages

There are three factories––each corresponding to one of the three roles––which
we can use to append messages to the strand's message list.

```ts
function* g() {
  yield* L.system`Message A.`
  yield* L.user`Message B.`
  yield* L.assistant`Message C.`
}
```

When we execute this generator function as a strand, the following messages will
be appended to its message list.

```json
[
  {
    "role": "user",
    "content": "Message A."
  },
  {
    "role": "user",
    "content": "Message B."
  },
  {
    "role": "assistant",
    "content": "Message C."
  }
]
```

## Role Boundaries

Although these role descriptions may suggest strict definitional boundaries,
they're actually quite open to interpretation; we can decide what messages
should assume what roles.

For example, a common pattern is to have the language model converse with
itself.

```ts
function* g() {
  yield* L.user`Hi, how are you today?`
  while (true) {
    yield* L.reply
    const next = yield* L.strand(function*() {
      yield* L.user`Please reply to your last message as if you're me.`
      return yield* L.reply
    })
    yield* L.user(next)
  }
}
```

Here a child strand replies for its parent.

## Message Format

Liminal provides a model-agnostic interface for messages. Whenever we send
messages to a given model, they are transformed into the Model-specific format.

```ts
function* g() {
  yield* L.model(ai(openai("gpt-4o-mini")))
  yield* L.user`User message A.`
  yield* L.assistant

  yield* L.model(xai("grok-3-mini-beta"))
  yield* L.user`User message B.`
  yield* L.assistant
}
```

TODO: Add streams info here

[^1]: [LLM assistant message seeding](https://padolsey.medium.com/simple-llm-gpt-trick-seeding-08fbcc1880c7)
