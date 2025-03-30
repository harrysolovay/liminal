# Liminal <Badge type="warning" text="beta" />

Liminal is a model-agnostic library for conversation state management. It
exposes a set of primitives for buffering messages, generating text, objects and
vectors, attaching and detaching tools, emitting events, and instantiating and
branching conversations. Conversation definition types are inferred to narrow
even types for observers. Liminal conversations can be executed with any
underlying model; for example, see
[the Vercel AI SDK reference adapter](./packages/ai/README.md).

## Resources

- [Documentation &rarr;](https://liminal.land)<br />Usage guide intended for
  human readers.
- [llms.txt &rarr;](./llms.txt)<br />Chunks of truth to be fed into LLMs.
- [Examples &rarr;](https://github.com/harrysolovay/liminal/tree/main/examples)<br />Examples
  illustrating common use cases.

## Benefits

<!-- - [Decouple Models From Conversations &rarr;](./why/decoupling_models_from_conversations.md)<br />Ensure
  conversations can be executed with any provider/model.
- [Message Buffer Management &rarr;](./why/message_buffer_management.md)<br />Intuitive
  conventions-based approach to managing message buffers.
- [Observing Execution &rarr;](./why/observing_execution.md)<br />Handle receive
  key events within the conversation and its descendants.
- [Static Type Inference &rarr;](./why/static_type_inference.md)<br />TRPC-style
  type inference of conversation events.
- [Eliminating Boilerplate &rarr;](./why/eliminating_boilerplate.md)<br />Avoid
  redundancies of requesting completions and embeddings. -->

## Overview

Model a conversation as a generator function. Yield user messages and assistant
`Value`s. Optionally return a result (in this case `ranking`).

```ts
import { Inference, Model } from "liminal"

function* PlantGrowthRanking() {
  // Describe the requirement of a language model by the key of `"default"`.
  yield* Model.language("default")

  // Buffer a user message.
  yield "What are some key factors that affect plant growth?"

  // Complete text and add it (as an assistant message) to the buffer.
  const factors = yield* Inference()

  // Buffer another user message.
  yield "Rank those by order of importance"

  // Same as before, but this time with a `ZodType` (could use another Standard Schema type).
  const { ranking } = yield* Inference(z.object({
    ranked: z.string().array(),
  }))

  // Return a result from the conversation.
  return ranking
}
```

Execute the conversation with the LLM client library and models of your
choosing. In this case we use Vercel's AI SDK and specify the `gpt-4o-mini`
model.

```ts
// ...

import { openai } from "@ai-sdk/openai"
import { AILanguageModel } from "liminal-ai"

const { result } = Conversation(PlantGrowthRanging)
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
  })
  .reduce()

result satisfies Array<string>
```

## Actions

Actions are the values yielded from Liminal conversations (generator functions
or iterables). They tell the executor how to update internal state such as the
model or tool selections.

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
