# Liminal

> Liminal is a work in progress. The documentation may not reflect the current
> implementation.

Liminal is an [Effect-based](https://effect.website/) library for composing
conversation trees with language models.

- [Documentation &rarr;](https://liminal.land)<br />Usage guide intended for
  human readers.
- [Examples &rarr;](https://github.com/harrysolovay/liminal/tree/main/examples)<br />Examples
  illustrating common use cases.
- [llms.txt &rarr;](https://liminal.land/llms.txt)<br />Chunks of truth to be
  fed into LLMs.

## Overview

Model a conversation as a generator function. Yield Liminal Effects to interact
with the underlying state of the conversation strand.

```ts
import { Effect } from "effect"
import { L, strand } from "liminal"

await Effect
  .gen(function*() {
    yield* L
      .user`Decide on a subtopic for us to discuss within the domain of technological futurism.`
    yield* L.assistant()
    yield* L
      .user`Great, please teach something interesting about this choice of subtopic.`
    yield* L.assistant()
    let i = 0
    while (i < 3) {
      const reply = yield* Effect
        .gen(function*() {
          yield* L.user`Please reply to the last message on my behalf.`
          return yield* L.assistant()
        })
        .pipe(strand())
      yield* L.user(reply)
      yield* L.assistant()
      i++
    }
    yield* L.user`Please summarize the key points from our conversation.`
    return yield* L.assistant()
  })
  .pipe(
    strand({
      system: `
        When an instruction is given, don't ask any follow-up questions.
        Just reply to the best of your ability given the information you have.
      `,
    }),
    Effect.provide(OpenAiLanguageModel.model("gpt-4o-mini")),
    Effect.provide(
      OpenAiClient
        .layerConfig({
          apiKey: Config.redacted("OPENAI_API_KEY"),
        })
        .pipe(Layer.provide(FetchHttpClient.layer)),
    ),
    Effect.runPromise,
  )
  .then(console.log)
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
