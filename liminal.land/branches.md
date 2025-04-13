# Liminal Branches <Badge type="warning" text="beta" />

Create isolated duplicates of the current conversation and explore different
trajectories.

```ts
function* g() {
  // ...
  const result = yield* branch(function*() {
    // ...
  })
}
```

```ts
function* g() {
  // ...
  const { a, b } = yield* branch({
    *a() {
      // ...
    },
    *b() {
      // ...
    },
  })
}
```

```ts
function* g() {
  const [a, b] = yield* branch([
    function*() {
      // ...
    },
    function*() {
      // ...
    },
  ])
}
```

```ts
declare const values: Array<string>

declare function agent(value: string): Generator<Action, boolean>

function* g() {
  const results = yield* branch(values.map(agent))
}
```
