# Effect Primer <Badge type="warning" text="beta" />

## Effect Overview

[The effect library](https://effect.website) is a comprehensive toolkit and
functional effect system for TypeScript. It provides a foundational building
block,
[the `Effect` type](https://effect.website/docs/getting-started/the-effect-type/),
with which we compose our programs. Liminal exposes effects and effect factories
specifically geared towards conversation management. The Effect runtime then
interprets our program, thereby progressing the underlying conversation state.

## Runtime Requirements

One of the driving motivations to model programs as Effects is dependency
injection of runtime requirements. In an effect program, we can create a context
tag, which represents a value that the program will ultimately need in order to
execute.

For example, we can define a `Random` context tag, which will allow us to
decouple our random number factory implementation from its usage.

<<< @/_blocks/effect_di.ts

<br />

This effect capability provides the foundation for model-agnosticism as well as
conversation state shadowing subtrees of our program.

## Model-agnosticism

Liminal uses Effect AI's `AiLanguageModel` tag in order to keep Liminal effects
decoupled from any language model or provider. Under the hood, Liminal effects
yield the tag to implement against a single interface that represents the shared
capabilities of different language models.

```ts twoslash
// @noErrors
import { Effect } from "effect"
// ---cut---
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"

Effect.gen(function*() {
  const lm = yield* AiLanguageModel
  lm.
  // ^|
})
```

<br />

## Conversations as Context

Liminal also uses Effect's dependency injection to provide the current the
[thread](/threads) (a conversation isolate), to subtrees of your program.

When we `yield*` message effects, they retrieve and operate on the current
conversation from the fiber context.

```ts twoslash
import { Effect } from "effect"
import L from "liminal"
// ---cut---
const conversation = Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant
  yield* L.user`...`
  yield* L.assistant
})
```

We provide threads (represented as Effect
[layers](https://effect.website/docs/requirements-management/layers/)) to denote
the boundary of the conversation.

<<< @/_blocks/conversation_boundaries.ts

---

Lets further-explore the behavior of threads in the next chapter.
