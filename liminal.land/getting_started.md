---
prev: false
---

# Getting Started <Badge type="warning" text="beta" />

## Installation

Install Liminal with your package manager of choice.

::: code-group

```bash [npm]
npm install liminal
```

```bash [bun]
bun install liminal
```

```bash [deno]
deno add npm:liminal
```

```bash [pnpm]
pnpm install liminal
```

```bash [yarn]
yarn add liminal
```

:::

## First Steps

### Example Problem

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

The error message we return is opaque. The submitter lacks information about why
validation failed.

### Example Solution

Let's turn our function into a Liminal agent and infer a helpful validation
message.

```ts {7-9}
import { openai } from "@ai-sdk/openai"
import { L } from "liminal"
import { ai } from "liminal-ai"

export function* validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    yield* L.model(ai(openai("gpt-4o-mini"))) // 1. Specify the language model.
    yield* L.user`Why is the following email is invalid?: "${email}".` // 2. Ask a question.
    const error = yield* L.assistant // 3. Infer the answer.
    return { error }
  }
  return { valid: true }
}
```

#### Running `validateEmail`

Await `L.strand` to call `validateEmail`.

```ts {7}
// ...

export function validationEndpoint(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  if (email) {
    const result = await L.strand(validateEmail(email))
    return Response.json(result)
  }
  // ...
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

In the next section, we dive deep into what makes something "runic" in Liminal.
