# Declaring Models

In order to avoid coupling a conversation to a model, we declare the usage of a
model.

```ts
import { apply, declareLanguageModel } from "liminal"

function* G() {
  yield* declareLanguageModel("my-model")
  // ...
}
```

Only upon executing the conversation do we provide the actual model
implementation.

```ts
// ...

import { openai } from "@ai-sdk/openai"
import { AILanguageModel } from "liminal-ai"

apply(G, {
  "my-model": AILanguageModel(openai("gpt-4o-mini")),
}).exec()
```
