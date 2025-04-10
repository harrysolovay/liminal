# Liminal Actions

Actions are the means by which we update and access state about a given scope.

## `yield*`able Factories

Each action has a corresponding factory that produces a yield*able of the action
definition.

For example, the `user` factory produces a generator that yields the
`UserMessage` action definition.

```ts
function* G() {
  yield* user`User message contents here.`
}
```

In this example, the executor will––when yield*ed the `UserMessage`
action––append it to the scope's message list.

## Accessing Results

In other cases the executor might also set the scope's `next` value so that we
can access it as the factory-produced generator's result.

```ts
function* G() {
  // ...
  const inferred = yield* infer()
}
```
