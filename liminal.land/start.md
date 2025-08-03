# Liminal Quickstart <Badge type="warning" text="beta" />

## Installation

Install `liminal`, `effect`, `@effect/platform` and `@effect/ai` with your
JavaScript package manager of choice.

::: code-group

```bash [npm]
npm i liminal effect @effect/platform @effect/ai
```

```bash [bun]
bun i liminal effect @effect/platform @effect/ai
```

```bash [deno]
deno add npm:liminal npm:effect npm:@effect/platform npm:@effect/ai
```

```bash [pnpm]
pnpm i liminal effect @effect/platform @effect/ai
```

```bash [yarn]
yarn install liminal effect @effect/platform @effect/ai
```

:::

Additionally, install the Effect AI model-provider-specific package that we'll
use to execute our conversations.

::: code-group

```bash [npm]
npm install @effect/ai-openai
```

```bash [bun]
bun install @effect/ai-openai
```

```bash [deno]
deno add @effect/ai-openai
```

```bash [pnpm]
pnpm @effect/ai-openai
```

```bash [yarn]
yarn add @effect/ai-openai
```

:::

> [!NOTE]
> Explore
> [alternative providers here](https://effect.website/docs/ai/introduction/#packages).

## Conversation Effects

Liminal's effects and effect factories are accessible from the `L` namespace.

```ts twoslash
// @noErrors
import { L } from "liminal"

L.
//^|
```

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

We yield Liminal Effects within an `Effect.gen` body to control the underlying
conversation state without manually managing structures the list of messages.

```ts twoslash
import { Effect } from "effect"
import { L } from "liminal"
// ---cut---
const conversation = Effect.gen(function*() {
  // Append some initial messages.
  yield* L.user`...`
  yield* L.assistant
  yield* L.user`...`
  yield* L.assistant

  // Ask for a summary.
  yield* L.user`Summarize our conversation.`
  const summary = yield* L.assistant

  // Clear the current conversation.
  yield* L.clear

  // Append the summary.
  yield* L.user`Conversation summary: ${summary}`
})
```

## Example Use Case

Let's consider a function that validates an email address and returns either a
validation error message or undefined if the supplies address is valid.

```ts twoslash
declare const EMAIL_REGEX: RegExp
// ---cut---
const validateEmail = (email: string): string | undefined => {
  // If valid, return undefined.
  if (EMAIL_REGEX.test(email)) return

  // If invalid, return the error message.
  return "Invalid email format."
}
```

The error message we return is opaque; the caller lacks information about why
validation failed. Let's use Liminal to infer a helpful validation error
message.

```ts {5,8} twoslash
import { Effect } from "effect"
import { L } from "liminal"
declare const EMAIL_REGEX: RegExp
// ---cut---
const validateEmail = Effect.fn(function*(email: string) {
  if (EMAIL_REGEX.test(email)) return

  // Provide a system prompt.
  yield* L.system`You are an email-validating assistant.`

  // If invalid, ask why.
  yield* L.user`Why is the following email is invalid?: "${email}".`

  // Infer and return the message.
  return yield* L.assistant
})
```

## Conversation Boundary

We mark the boundary of the Effect's conversation by providing a `Strand`.

```ts {6} twoslash
import { Effect } from "effect"
import { L } from "liminal"
// ---cut---
const validateEmail = (email: string) =>
  Effect.gen(function*() {
    // Same as above...
    return yield* L.assistant
  }).pipe(
    L.strand,
  )
```

## Specifying Models

Some Liminal effects require a language model to specified. This is provided
using the Effect AI `AiLanguageModel` tag.

Let's create a layer to provide an OpenAI `AiLanguageModel`.

`_model.ts`

```ts twoslash
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Config, Layer } from "effect"

const model = OpenAiLanguageModel.model("gpt-4o-mini").pipe(
  Layer.provide(
    OpenAiClient.layerConfig({
      apiKey: Config.redacted("OPENAI_API_KEY"),
    }).pipe(
      Layer.provide(FetchHttpClient.layer),
    ),
  ),
)
```

We can now provide the `model` layer to any effect's we're ready to execute. You
may want to satisfy requirements once at the root of your effect program.
Alternatively, you can use it in the leaves of your program, such as in
`validateEmail`.

```ts twoslash {7}
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import { Effect, Layer } from "effect"
import type { ConfigError } from "effect/ConfigError"
import { L } from "liminal"

declare const model: Layer.Layer<AiLanguageModel, ConfigError, never>
// ---cut---
const validateEmail = (email: string) =>
  Effect.gen(function*() {
    // Same as above...
    return yield* L.assistant
  }).pipe(
    L.strand,
    Effect.provide(model),
  )

const errorMessage = await validateEmail("≽^•⩊•^≼").pipe(
  Effect.runPromise,
)
```

If the supplied email address is invalid, we may get error messages similar to
the following.

- `john..doe@example`: Your email is missing the top-level domain (like .com or
  .org) after 'example'.
- `user@domain`: Your email address is incomplete and missing the domain
  extension.
- `john@example..com`: Your email contains consecutive dots which aren't allowed
  in a valid address.

---

In the next chapter, we touch on key concepts surrounding Liminal's
implementation and usage.
