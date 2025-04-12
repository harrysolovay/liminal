# Liminal Declaration

## Model Declaration

Models are never hard-coded into Liminal agents. Instead, we specify keys.

```ts
const g = L.f(L.string, function*(value) {
  yield* L.infer
  yield* L.model("mini")
  yield* L.infer
  yield* L.model("reasoning")
  yield* L.infer
})
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
