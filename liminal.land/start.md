---
prev: false
---

# Getting Started <Badge type="warning" text="beta" />

## Installation

Install `liminal` with your JavaScript package manager of choice.

::: code-group

```bash [npm]
npm install liminal
```

```bash [bun]
bun install liminal liminal-openai
```

```bash [deno]
deno add npm:liminal npm:liminal-openai
```

```bash [pnpm]
pnpm install liminal liminal-openai
```

```bash [yarn]
yarn add liminal liminal-openai
```

:::

Also install the adapter for your client of choice. Current options include
OpenAI, Ollama and the Vercel AI SDK (see
[the adapter documentation](./models.md)).

## API Overview

```ts
import { L } from "liminal"
import { adapter } from "liminal-openai"

const reply = await L.run(function*() {
  // Set the model.
  yield* L.model(adapter("gpt-4o-mini"))

  // Append a system message.
  yield* L.system`<system-message-here>`

  // Append a user message.
  yield* L.user`<user-message-here>`

  // Trigger an assistant reply.
  const modelReply = yield* L.assistant

  return modelReply
})

reply satisfies string
```

Within the generator function scope, we can yield these `L`-namespaced
directives (called "[runes](./strands.md#runes)"). These statements allow us to
control the underlying conversation state without manually managing structures
such as conversation lists and toolboxes.

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

```ts {5,7-9}
import { L } from "liminal"
import { openai } from "liminal-openai"

export async function validateEmail(email: string) {
  return await L.strand(function*() {
    if (!EMAIL_REGEX.test(email)) {
      yield* L.model(openai("gpt-4o-mini")) // 1. Specify the language model.
      yield* L.user`Why is the following email is invalid?: "${email}".` // 2. Ask a question.
      const error = yield* L.assistant // 3. Infer the answer.
      return { error }
    }
    return { valid: true }
  })
}
```

If the supplied email address is invalid, we may get error messages similar to
the following.

- `john..doe@example`: Your email is missing the top-level domain (like .com or
  .org) after 'example'.
- `user@domain`: Your email address is incomplete and missing the domain
  extension.
- `john@example..com`: Your email contains consecutive dots which aren't allowed
  in a valid address.

## Next Steps

In the next section, we dive deep into what makes something a Liminal
definition.
