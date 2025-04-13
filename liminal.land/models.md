# Liminal Declaration <Badge type="warning" text="beta" />

## Model Adapters

- [Anthropic](./model_adapters/anthropic)
- [OpenAI](./model_adapters/openai)
- [xAI](./model_adapters/xai)
- [Ollama](./model_adapters/ollama)
- [Google Generative AI](./model_adapters/google_gen_ai)
- [(Vercel) AI SDK](./model_adapters/ai-sdk)
- [DeepSeek](./model_adapters/deepseek)

## Model Declaration

Models are never hard-coded into Liminal agents. Instead, we specify keys.

```ts
function* g(value) {
  yield* L.infer
  yield* L.model("mini")
  yield* L.infer
  yield* L.model("reasoning")
  yield* L.infer
}
```

Only upon execution do we mind a model to these keys.

```ts
declare const root: LanguageModel
declare const mini: LanguageModel
declare const reasoning: LanguageModel

const exec = await g()
  .run(root, { mini, reasoning })
  .on((event) => {
    console.log(event)
  })
```

## Host Declaration

## Building Model Adapters
