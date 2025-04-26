# Liminal

> Liminal is a work in progress. The documentation may not reflect the current
> implementation.

Liminal is a toolkit for composing conversation trees with language models using
TypeScript iterators. Model a conversation with building blocks for appending
messages, inferring replies, focusing new language models, emitting events to
observers and branching conversation strands.

- [Documentation &rarr;](https://liminal.land)<br />Usage guide intended for
  human readers.
- [Examples &rarr;](https://github.com/harrysolovay/liminal/tree/main/examples)<br />Examples
  illustrating common use cases.
- [llms.txt &rarr;](https://liminal.land/llms.txt)<br />Chunks of truth to be
  fed into LLMs.

<!-- ## Rationale

- [Implicit Message Buffers &rarr;](./liminal.land/rationale/implicit_message_buffers.md)<br />Intuitive
  conventions-based approach to managing message buffers.
- [Decoupling Conversations From Models &rarr;](./liminal.land/rationale/decoupling_conversations_from_models.md)<br />Ensure
  conversations can be executed with any provider/model.
- [Eliminating Boilerplate &rarr;](./liminal.land/rationale/eliminating_boilerplate.md)<br />Avoid
  the redundancies of inferencing and embedding. -->

<!-- - [Type-safe Observability &rarr;](https://liminal.land/rationale/type-safe_observability)<br />Observe
  events from the entire conversation tree; infer event static types like with
  TRPC or Hono Client.
- [Step Comparison &rarr;](https://liminal.land/rationale/eliminating_boilerplate.md)<br />Stepped
  execution of the same conversation with different models. -->

## Overview

Model a conversation as a generator function. Yield Liminal "runes" to interact
with the underlying state of the conversation strand.

[`examples/readme.ts`](./examples/readme.ts)

```ts
import { L } from "liminal"
import { adapter } from "liminal-ollama"

await L.strand(
  function*() {
    // Kick off the conversation.
    yield* L.model(adapter("gemma3:1b"))
    yield* L.user`Decide on a topic for us to discuss.`
    yield* L.assistant

    // Loop through some conversation turns.
    let i = 0
    while (i++ < 3) {
      // Have the language model respond to itself in an isolated copy of the current "strand."
      const reply = yield* L.strand(function*() {
        yield* L.user`Please reply to the last message on my behalf.`
        return yield* L.assistant
      })

      // Use the child strand's return value to append a user message within the root "strand."
      yield* L.user(reply)
      yield* L.assistant
    }

    yield* L.user`Summarize key points from our conversation.`
    return yield* L.assistant
  },
  { handler: console.log },
)
```

> Note: `async function*() { // ...` is perfectly valid if you wish to use await
> promises.

## Running Examples Locally

1. Clone and build Liminal.

   ```sh
   git clone git@github.com:harrysolovay/liminal.git
   cd liminal
   bun i
   bun run build
   ```

2. Configure any environment variables used by the example.

3. Run one of the example files.

   ```sh
   bun examples/<path-to-example>
   ```

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
