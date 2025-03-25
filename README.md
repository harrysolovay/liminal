# Liminal

Liminal is a model-agnostic library for LLM conversation state management. It
exposes a set of primitives for buffering messages, triggering completions and
vectorizations, attaching and detaching tools, emitting events to observers, and
instantiating and branching conversations. Conversation definition types are
captured to ensure type-safe usage of events within observers. Liminal
conversations can be executed with any underlying LLM client; for example, see
[the Vercel AI SDK reference adapter](./packages/ai/README.md).

## Resources

- [llms.txt &rarr;](./llms.txt)<br />Chunks of truth to be fed into LLMs.
- [Examples &rarr;](https://liminal.land/examples)<br />Examples illustrating
  common use cases.

## Benefits

- [Decouple Models From Conversations &rarr;](./docs/why/decoupling_models_from_conversations.md)<br />Ensure
  conversations can be executed with any provider/model.
- [Message Buffer Management &rarr;](./docs/why/message_buffer_management.md)<br />Intuitive
  conventions-based approach to managing message buffers.
- [Observing Execution &rarr;](./docs/why/observing_execution.md)<br />Handle
  receive key events within the conversation and its descendants.
- [Static Type Inference &rarr;](./docs/why/static_type_inference.md)<br />TRPC-style
  type inference of conversation events.
- [Eliminating Boilerplate &rarr;](./docs/why/eliminating_boilerplate.md)<br />Avoid
  redundancies of requesting completions and embeddings.

## Overview

Model a conversation as a generator function. Yield user messages and assistant
`Value`s. Optionally return a result (in this case `ranking`).

```ts
import { Exec, Value } from "liminal"

function* Conversation() {
  // Buffer a user message.
  yield "What are some key factors that affect plant growth?"

  // Complete text and add it (as an assistant message) to the buffer.
  const factors = yield* Value()

  // Buffer another user message.
  yield "Rank those by order of importance"

  // Same as before, but this time with a `ZodType` (could use another Standard Schema type).
  const ranking = yield* Value(z.string().array())

  // Return a result from the conversation.
  return ranking
}
```

Execute `Conversation` with the LLM client library and models of your choosing.
In this case we use Vercel's AI SDK and specify the `gpt-4o-mini` model.

```ts
// ...

import { openai } from "@ai-sdk/openai"
import { adapter } from "liminal-ai"

const result = await Exec(adapter).run(Conversation, {
  models: {
    default: openai("gpt-4o-mini"),
  },
})

result satisfies Array<string>
```

## Actions

Actions are the values yielded from Liminal conversations (generator functions
or iterables). They tell the executor how to update internal state such as the
model or tool selections.

- [`string | Array<string>` &rarr;](./docs/actions/TODO.md)<br />append user
  messages to the message buffer.
- [`Value` &rarr;](./docs/actions/TODO.md)<br />trigger a completion (optional
  include a [Standard Schema](https://standardschema.dev/) type to inform
  structured output shape).
- [`Context` &rarr;](./docs/actions/TODO.md)<br />Create a container with a
  specified key, system message and untouched message buffer.
- [`Branch` &rarr;](./docs/actions/TODO.md)<br />Create isolated duplicates of
  the current conversation and explore different trajectories.
- [`Tool | DisableTool` &rarr;](./docs/actions/TODO.md)<br />Enable and disable
  tools to be used by underlying completions calls.
- [`Emit` &rarr;](./docs/actions/TODO.md)<br />Emit some data that observers can
  utilize, perhaps for writing to a database or displaying conversation progress
  to users.
- [`Messages` &rarr;](./docs/actions/TODO.md)<br />Get the current list of
  messages contained within the message buffer.
- [`Embedding` &rarr;](./docs/actions/TODO.md)<br />Get the vector embedding
  representation of a value.
- [`LanguageModel | EmbeddingModel` &rarr;](./docs/actions/TODO.md)<br />Declare
  the intended use of a model by specifying a key to which the executor
  ultimately binds a model.

---

## **Code of Conduct**

Please ensure you adhere to our [code of conduct](CODE_OF_CONDUCT.md) when
interacting in this repository.

---

## **Contributing**

Contributions are welcome and appreciated! Check out the
[contributing guide](CONTRIBUTING.md) before you dive in.

---

## **License**

Liminal is [Apache-licensed](LICENSE).
