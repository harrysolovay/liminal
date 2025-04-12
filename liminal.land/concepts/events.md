# Liminal Events

```ts
function* g() {
  yield* L.event("my-event")
}
```

```ts
await exec(g, {
  default: defaultModel,
  handler(event) {
    if (event === "my-event") {
      // ...
    }
  },
})
```

```ts
export type AppEvent = {
  type: "A"
  value: string
} | {
  type: "B"
  value: number
}

export const AppEvent = L.event<AppEvent>
```

```ts
function* g() {
  yield* AppEvent({
    type: "a",
    value: "A",
  })
  yield* AppEvent({
    type: "b",
    value: 101,
  })
}
```

```ts
await exec(g, {
  default: defaultModel,
  handler(event) {
    if (event.type === "a") {
      event.value satisfies string
    } else if (event.type === "b") {
      event.value satisfies number
    } else {
      event.value satisfies never
    }
  },
})
```
