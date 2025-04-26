# Liminal Branches <Badge type="warning" text="beta" />

Create isolated duplicates of the current conversation and explore different
trajectories.

```ts
function* g() {
  // ...
  const result = yield* strand(function*() {
    // ...
  })
}
```

```ts
function* g() {
  // ...
  const { a, b } = yield* strand({
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
  const [a, b] = yield* strand([
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

function* g() {
  const results = yield* strand(values.map(function*() {
    // ...
  }))
}
```
