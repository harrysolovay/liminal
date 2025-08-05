# Liminal Quickstart <Badge type="warning" text="beta" />

## Installation

Install `liminal` with your JavaScript package manager of choice.

::: code-group

```bash [npm]
npm i liminal
```

```bash [bun]
bun i liminal
```

```bash [deno]
deno add npm:liminal
```

```bash [pnpm]
pnpm i liminal
```

```bash [yarn]
yarn install liminal
```

:::

> [!NOTE]
> Depending on whether you package manager auto-installs peer dependencies, you
> may need to also install `effect`, `@effect/platform` and `@effect/ai`.

Additionally, install
[an Effect AI model provider](https://effect.website/docs/ai/introduction/#packages),
which we'll use to execute our conversations.

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

## Conversation Effects

Liminal's effects and effect factories are accessible from the `L` namespace.

```ts twoslash
// @noErrors
import { L } from "liminal"

L.
//^|
```

<LCompletionsBottomMargin />

We yield Liminal Effects within an `Effect.gen` body to control the underlying
conversation state without manually managing structures the list of messages.

<<< @/_blocks/messaging_101.ts

## Example Use Case

Let's consider a function that validates an email address and returns either a
validation error message or undefined if the supplies address is valid.

<<< @/_blocks/validateEmail_initial.ts

The error message we return is opaque; the caller lacks information about why
validation failed.

Let's use Liminal to infer a helpful validation error message. Also note how we
`pipe` the effect into `L.strand` to mark the boundary of the conversation.

<<< @/_blocks/validateEmail.ts{7,10,13,15}

## Configuring Model Layer

Some Liminal effects require a language model to specified. This is provided
using the Effect AI `AiLanguageModel` tag.

Let's create a layer to provide an OpenAI `AiLanguageModel`.

`ModelLive.ts`

<<< @/_blocks/ModelLive.ts

## Running the Conversation

We can now provide the `model` layer to any effect's we're ready to execute. You
may want to satisfy requirements once at the root of your effect program.
Alternatively, you can use it in the leaves of your program.

<<< @/_blocks/validateEmail_run.ts {5-6}

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
