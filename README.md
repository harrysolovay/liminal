# Liminal

Liminal is a model-agnostic library for LLM conversation state management. It
exposes a set of primitives for buffering messages, triggering completions,
attaching and detaching tools, emitting events to observers, and instantiating
and branching conversations. Static types are captured to ensure type-safe usage
of events within observers. Liminal conversations can be executed with any
underlying LLM client; for example, see
[the Vercel AI SDK reference adapter](./packages/ai/README.md).

## Resources

- [llms.txt &rarr;](./llms.txt)<br />Chunks of truth to be fed into LLMs.
- [Examples &rarr;](https://liminal.land/examples)<br />Examples illustrating
  common use cases.

## Benefits

- [Decouple Models From Conversations &rarr;](./docs/why/decoupling_models_from_conversations.md)<br />Ensure
  conversations can be executed with any provider/model and circumvent vendor
  lock-in.
- [Implicit Message Buffer &rarr;](./docs/why/message_buffer_management.md)<br />Conventions-based
  approach to managing message buffers.
- [Static Type Inference &rarr;](./docs/why/static_type_inference.md)<br />TRPC-style
  type inference of conversation events for use within consumers.
- [Eliminating Boilerplate &rarr;](./docs/why/eliminating_boilerplate.md)<br />Avoid
  redundancies every time you wish to trigger a completion or vectorization.

## Example

```ts
import { T } from "liminal"

function* Conversation() {
  // Buffer a user message.
  yield "What are some key factors that affect plant growth?"

  // Complete text and add it (as an assistant message) to the buffer.
  const factors = yield* T()

  // Buffer another user message.
  yield "Rank those by order of importance"

  // Same as before, but this time with a `ZodType` (could use another Standard Schema type).
  const ranking = yield* T(z.string().array())

  // Return a result from the conversation.
  return ranking
}
```

Execute the conversation.

```ts
import { Exec } from "liminal"

// Let's use the Vercel AI SDK under the hood.
import { openai } from "@ai-sdk/openai"
import { adapter } from "liminal-ai"

// Execute the conversation.
const result = await Exec(adapter).run(Conversation, {
  models: {
    default: openai("gpt-4o-mini"),
  },
})

result satisfies Array<string>
```

## Why?

- TRPC/Hono-style event inference
- Establish a TypeScript-centric way to define reusable flows without getting
  locked into specific LLM providers/models/client libraries
- Inject model upon flow execution. This means that we can share flow libraries
  without being bound to a specific LLM
- Attaching descriptions to schemas / virtual types that cater better to the LLM
  use case
- Eliminating completion API boilerplate
- Keeping model selection decoupled from flows.
- Abstracting away direct management of context buffers
- Observability within complex flows

## Other Perks

- Handles dedent-ing

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
