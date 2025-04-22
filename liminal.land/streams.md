# Liminal Streams

## Basic Usage

The `L.stream` directive can be used to produce a standard Web Stream
representing a list of chunks from the model.

```ts
function* g() {
  yield* L.user("write a poem")

  const stream = L.fork(L.assistant.stream(stream => stream))



  const result = yield* L.assistant.stream((stream: ReadableStream) => {
    ...
    return 123
  })

  result == 123

    const stream =  yield* L.assistant.stream()

  let message = ""
  for await(const chunk of stream) {
message += chunk
  }

  yield* L.user("your poem was " + message.length " characters long");



  const final = yield* L.assistant.stream(function*(chunk) {
    // ...
  })

  const stream = yield* L.stream()

  yield* L.user("write everything in ALL CAPS")

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
async function* g() {
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
