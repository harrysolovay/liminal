# Runtime <Badge type="warning" text="beta" />

To execute Liminal agents, we use `exec` and specify the models to which we want
to bind any `L.model`-declared keys.

For example, let's say we want to execute the following agent.

```ts
function* g() {
  yield* L.model("default")
  yield* L.user`How are you today?`
  return yield* L.reply
}
```

We must bind a model to `g`.
