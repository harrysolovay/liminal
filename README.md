# Liminal

> Primitives for LLM tool-calling and context management.

- [llms.txt &rarr;](./llms.txt)<br />Chunks of truth to be fed into LLMs.
- [Awesome &rarr;](./AWESOME.md)<br />An awesome list from the open source
  community
- [Examples &rarr;](https://liminal.land/examples)<br />Examples illustrating
  common use cases.

```ts
import { T } from "liminal"

function* Conversation() {
  // Buffer a user message.
  yield "What are some key factors that affect plant growth?"

  // Complete text and add assistant message to the buffer.
  const factors = yield* T()

  // Buffer another user message.
  yield "Rank those by order of importance"

  // Trigger and return a structured output completion.
  return yield* T(z.string().array())
}
```

Execute the conversation.

```ts
import { Exec } from "liminal"

// Let's use the Vercel AI SDK under the hood.
import { openai } from "@ai-sdk/openai"
import { adapter } from "liminal-ai"

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
- Allow tools to specify requirements – type-safe
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
