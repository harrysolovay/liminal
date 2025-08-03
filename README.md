# Liminal

> Liminal is a work in progress. The documentation may not reflect the current
> implementation.

Liminal is an [Effect](https://effect.website/)-based library for composing
conversation trees with language models.

- [Documentation &rarr;](https://liminal.land)<br />Usage guide intended for
  human readers.
- [Examples &rarr;](https://github.com/harrysolovay/liminal/tree/main/examples)<br />Examples
  illustrating common use cases.
- [llms.txt &rarr;](https://liminal.land/llms.txt)<br />Chunks of truth to be
  fed into LLMs.

## Overview

Model a conversation as an Effect.

`example.ts`

```ts
import { FileSystem } from "@effect/platform"
import { Console, Effect } from "effect"
import { L } from "liminal"

const conversation = Effect.gen(function*() {
  // Initial context.
  yield* L.system`You are an expert TypeScript developer.`
  yield* L.user`
    It seems as though a new mental model may arise for
    LLM conversation state management.

    What are your thoughts on the following DX?
  `

  // Provide the currently-executing code for the assistant.
  const fs = yield* FileSystem.FileSystem
  yield* L.user(
    yield* fs.readFileString("example.ts"),
  )

  // Have the assistant reply.
  const reply = yield* L.assistant

  // ...
}).pipe(L.strand)
```

## Running Examples Locally

1. Clone and build Liminal.

   ```sh
   git clone git@github.com:harrysolovay/liminal.git
   cd liminal
   bun i
   bun run build
   ```

2. Configure any environment variables used by the example.

3. Run the example script.

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
