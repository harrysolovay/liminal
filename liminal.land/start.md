---
prev: false
---

# Getting Started <Badge type="warning" text="beta" />

## Installation

Install `liminal` with your JavaScript package manager of choice.

::: code-group

```bash [npm]
npm install @effect/ai @effect/ai-openai effect liminal
```

```bash [bun]
bun install @effect/ai @effect/ai-openai effect liminal
```

```bash [deno]
deno add npm:@effect/ai @effect/ai-openai npm:effect npm:liminal
```

```bash [pnpm]
pnpm install @effect/ai @effect/ai-openai effect liminal
```

```bash [yarn]
yarn add @effect/ai @effect/ai-openai effect liminal
```

:::

> Note: you can install alternative providers if you'd prefer one other than
> OpenAI. See
> [packages here](https://effect.website/docs/ai/introduction/#packages).

## API Overview

```ts
import { Effect } from "effect"
import { L, Strand } from "liminal"

const reply = Effect
  .gen(function*() {
    // Append a user message.
    yield* L.user`<user-message-here>`

    // Trigger an assistant reply.
    const modelReply = yield* L.assistant()

    return modelReply
  })
  .pipe(Effect.provide(Strand.layer({
    system: "<system-message-here>",
  })))

reply satisfies Effect.Effect<string, AiError, AiLanguageModel>
```

Within the generator function scope, we can yield these `L`-namespaced Effects.
These effects allow us to control the underlying conversation state without
manually managing structures such as conversation lists.

## Use Case Example

Let's consider a function that validates an email. Our initial implementation
may look as follows.

```ts
function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Invalid email format." }
  }
  return { valid: true }
}
```

The error message we return is opaque. The caller lacks information about why
validation failed.

### Example Solution

Let's turn our function into a Liminal strand and infer a helpful validation
message.

```ts
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Effect } from "effect"
import { L, Strand } from "liminal"

const validateEmail = (email: string) =>
  Effect
    .gen(function*() {
      if (!EMAIL_REGEX.test(email)) {
        // 1. Ask a question.
        yield* L.user`Why is the following email is invalid?: "${email}".`
        // 2. Infer the answer.
        const error = yield* L.assistant()
        return { error }
      }
      return { valid: true }
    })
    .pipe(
      // 3. Mark this effect as the boundary of the conversation.
      Effect.provide(Strand.layer()),
      // 4. Specify the model.
      Effect.provide(OpenAiLanguageModel.model("gpt-4o-mini")),
      // 5. Specify the HTTP client.
      Effect.provide(
        OpenAiClient
          .layerConfig({
            apiKey: Config.redacted("OPENAI_API_KEY"),
          })
          .pipe(Layer.provide(FetchHttpClient.layer)),
      ),
      // 6. Run the effect.
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
