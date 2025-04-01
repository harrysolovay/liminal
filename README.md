# Liminal

Liminal is a model-agnostic library for conversation state management. It
exposes a set of primitives for buffering messages, generating text, objects and
vectors, attaching and removing tools, emitting events, and instantiating and
branching conversations.

## Resources

- [Documentation &rarr;](https://liminal.land)<br />Usage guide intended for
  human readers.
- [llms.txt &rarr;](./llms.txt)<br />Chunks of truth to be fed into LLMs.
- [Examples &rarr;](https://github.com/harrysolovay/liminal/tree/main/examples)<br />Examples
  illustrating common use cases.

## Rationale

- [Implicit Message Buffers &rarr;](https://liminal.land/rationale/implicit_message_buffers.md)<br />Intuitive
  conventions-based approach to managing message buffers.
- [Decoupling Conversations From Models &rarr;](https://liminal.land/rationale/decoupling_from_models)<br />Ensure
  conversations can be executed with any provider/model.
- [Type-safe Observability &rarr;](https://liminal.land/rationale/type-safe_observability)<br />Observe
  events from the entire conversation tree; infer event static types like with
  TRPC or Hono Client.
- [Step Comparison &rarr;](https://liminal.land/rationale/eliminating_boilerplate.md)<br />Stepped
  execution of the same conversation with different models.
- [Eliminating Boilerplate &rarr;](https://liminal.land/rationale/eliminating_boilerplate.md)<br />Avoid
  the redundancies of inferencing and embedding.

## Overview

Model a conversation as a generator function. Yield model requirements, messages
and inference actions.

```ts
import { DeclareModel, Exec, Infer } from "liminal"

function* PlantGrowthRanking() {
  yield* DeclareModel.language("default")

  // User Message
  yield "What are some key factors that affect plant growth?"

  // Assistant Message
  const factors = yield* Infer()

  // User Message
  yield "Rank those by order of importance"

  // Assistant Message (structured output)
  const { ranking } = yield* Infer(z.object({
    ranking: z.string().array(),
  }))

  return ranking
}
```

> Note: `async function* YourFunction() { // ...` is perfectly valid if you need
> async/await.

## Execution

To execute the conversation, we must specify the models to associated with
yielded `Model` action keys.

```ts
// ...

import { openai } from "@ai-sdk/openai"
import { AILanguageModel } from "liminal-ai"

const { result } = Exec(PlantGrowthRanging)
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
  })
  .exec()

result satisfies Array<string>
```

## Actions

Actions are the values yielded from Liminal conversations (generators or other
iterables). They tell the executor how to update internal state such as the
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
