# Liminal

> Liminal is a work in progress. The documentation may not reflect the current
> implementation.

Liminal is a model-agnostic library for conversation state management. It
exposes a set of primitives for buffering messages, generating text, objects and
vectors, attaching and removing tools, emitting events and forking
conversations.

<!-- ## Resources

- [Documentation &rarr;](https://liminal.land)<br />Usage guide intended for
  human readers.
- [llms.txt &rarr;](./llms.txt)<br />Chunks of truth to be fed into LLMs.
- [Examples &rarr;](https://github.com/harrysolovay/liminal/tree/main/examples)<br />Examples
  illustrating common use cases. -->

## Running Locally

```ts
// Once:
git clone git@github.com:harrysolovay/liminal.git && cd liminal
bun i && bun run build

// Run example:
bun examples/agents/chaining
```

## Rationale

- [Implicit Message Buffers &rarr;](./liminal.land/rationale/implicit_message_buffers.md)<br />Intuitive
  conventions-based approach to managing message buffers.
- [Decoupling Conversations From Models &rarr;](./liminal.land/rationale/decoupling_conversations_from_models.md)<br />Ensure
  conversations can be executed with any provider/model.
- [Eliminating Boilerplate &rarr;](./liminal.land/rationale/eliminating_boilerplate.md)<br />Avoid
  the redundancies of inferencing and embedding.

<!-- - [Type-safe Observability &rarr;](https://liminal.land/rationale/type-safe_observability)<br />Observe
  events from the entire conversation tree; infer event static types like with
  TRPC or Hono Client.
- [Step Comparison &rarr;](https://liminal.land/rationale/eliminating_boilerplate.md)<br />Stepped
  execution of the same conversation with different models. -->

## Overview

Model a conversation as a generator function. Yield actions such as declaring
the model, appending messages to the underlying message buffer and triggering
inference.

`conversation.ts`

```ts
import { exec, L } from "liminal"

export default function*() {
  yield* L.declareLanguageModel("reasoning")
  yield* L.system`
    When an instruction is given, don't ask any follow-up questions.
    Just reply to the best of your ability given the information you have.
  `
  yield* L
    .user`Decide on a subtopic for us to discuss within the domain of technological futurism.`
  yield* L.infer
  yield* L
    .user`Great, please teach something interesting about this choice of subtopic.`
  yield* L.infer
  let i = 0
  while (i < 5) {
    const userReply = yield* L.fork("infer-user-reply", function*() {
      yield* L.user`Please reply to the last message on my behalf.`
      return yield* L.infer
    })
    yield* L.user(userReply)
    yield* L.infer
  }
  yield* L.user`Please summarize the key points from our conversation.`
  return yield* L.infer
}
```

> Note: `async function* Conversation() { // ...` is perfectly valid if you need
> async/await.

## Execution

When executing the conversation, we bind the model implementation to the key
with which we declared the model.

In this example, we use a Vercel AI SDK `LanguageModelV1` (produced by the
`openai` factory).

```ts
// ...

import { openai } from "@ai-sdk/openai"
import { AILanguageModel } from "liminal-ai"

// From before.
import conversation from "./conversation.ts"

const result = await exec(Conversation, {
  default: AILanguageModel(openai("gpt-4o-mini")),
  bind: {
    reasoning: AILanguageModel(openai("o3-mini")),
  },
})

result satisfies Array<string>
```

## Actions

Actions are the values yielded from Liminal conversations (generators or other
iterables/iterators). They tell the executor how to update internal state such
as the model or tool selection.

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
