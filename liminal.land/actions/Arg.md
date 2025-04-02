# Arg

When composing liminal actions, `Arg`s allow us to reference values that are
supplied at execution time.

This mechanism underlays language model declaration, wherein we specify a key to
which we later bind the actual `RunInfer` function.

```ts
import { apply, declareLanguageModel, RunInfer } from "liminal"

function* G() {
  yield* declareLanguageModel("my-model")
  // ...
}

apply(G, {
  "my-model": runInfer,
})

// Likely from a library such as `liminal-ai` or `liminal-ollama`.
declare const runInfer: RunInfer
```

We can utilize the `Arg` action directly by importing the `arg` factory and
calling it with a key and a type (which will constrain the to-be-applied value).

```ts
import { apply, arg } from "liminal"

function* G() {
  const value = yield* arg("name")<string>()
  console.log(`Hello ${value}.`)
}

apply(G, {
  name: "world",
})
```
