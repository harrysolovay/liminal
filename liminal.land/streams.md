# Liminal Streams

## Basic Usage

The `L.stream` directive can be used to produce a standard Web Stream
representing a list of chunks from the model.

```ts
function* g() {
  const stream = yield* L.stream()

  stream satisfies ReadableStream<string>
}
```

Because this gives us a Web Stream, we can easily iterate over the chunks using
`for await`.

```ts
for await (const chunk of stream) {
  chunk satisfies string
}
```

## Agent State Change

Just as with `L.reply`, the streamed output is ultimately placed inside an
Assistant message and appended to the message list. This can be circumvented by
isolating within a branch.

```ts
function* g() {
  for await (const chunk of yield* L.branch(L.stream())) {
    // ...
  }
}
```

## Item Structured Output

We can also specify a standard type to which items should conform, just as we
would with `L.reply`.

```ts
function* g() {
  const stream = yield* L.stream(L.object({
    value: L.string,
  }))

  stream satisfies ReadableStream<{
    value: string
  }>
}
```
