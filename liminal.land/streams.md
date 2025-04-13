# Streams

Liminal's streaming API aims to provide a unified approach for handling
different kinds of streaming completions, including list-based streams (text
chunks, objects) and object-based streams (materialization of a single
structure).

```ts
function* g() {
  const stream = yield* L.stream()

  for await (const chunk of stream) {
    chunk satisfies string
  }
}
```

```ts
for await (
  const chunk of L.stream(L.object({
    name: L.string,
  }))
) {
  console.log(chunk)
}
```

```ts
const objectStream = L.materialize(L.object({
  title: L.string,
  description: L.string,
  items: L.array(L.string),
}))

// Subscribe to partial materializations
objectStream.subscribe((partialObject) => {
  // partialObject might look like: { title: "Some title", description: "Partial..." }
  // as fields get populated incrementally
  console.log("Current state:", partialObject)
})

// Get final value when complete
const finalObject = await objectStream.value()
```

### 4. Control Flow with Pause/Resume/Cancel

```ts
const stream = L.stream(L.string)

// Start the stream
const controller = stream.start()

// Pause generation
controller.pause()

// Resume generation
controller.resume()

// Cancel generation and clean up resources
controller.cancel()

// Process with control
for await (const chunk of stream) {
  if (someCondition) {
    controller.pause()
    await userInteraction()
    controller.resume()
  }
}
```

### 5. Transformation and Composition

```ts
// Transform one stream to another
const textStream = L.stream(L.string)
const processedStream = textStream.map((chunk) => chunk.toUpperCase())

// Combine multiple streams
const stream1 = L.stream(L.array(L.number))
const stream2 = L.stream(L.array(L.string))
const combinedStream = L.combineStreams(
  [stream1, stream2],
  (numbers, strings) => ({ numbers, strings }),
)

// Chain streams sequentially
const resultStream = await L.chainStreams([
  () => L.stream(L.string),
  (prevResult) => L.stream(L.object({ text: L.string, prevLength: L.number })),
])
```

### 6. Unified Stream Type System

```ts
// Define the stream type explicitly
type UserStream = L.Stream<L.Type<User>>
type ChatMessageStream = L.Stream<L.Array<L.Type<ChatMessage>>>

// Create type-safe streams
const userStream: UserStream = L.stream(L.type<User>())
const messagesStream: ChatMessageStream = L.stream(
  L.array(L.type<ChatMessage>()),
)
```

## Implementation Considerations

1. **Internal Accumulator**: Each stream maintains an internal accumulator for
   its current state.

2. **Flexible Integration**: The API should work well with existing JavaScript
   async patterns while also providing Liminal-specific features.

3. **Memory Efficiency**: For large streams, consider options for
   memory-efficient processing.

4. **Error Handling**: Robust error handling for stream interruptions, network
   failures, etc.

5. **Backpressure**: Consider mechanisms for handling backpressure when
   consumers process data slower than it's produced.

## Usage Examples

### Example: Streaming Chat Completion

```ts
async function* chatCompletion() {
  const stream = L.stream(L.string)

  // Get the final full response
  const fullResponse = yield* stream

  return {
    fullResponse,
    // Other metadata
  }
}

// Usage
const generator = chatCompletion()
let result

// Option 1: Process with for-await
for await (const chunk of generator) {
  updateUI(chunk) // Show incremental updates
}
result = generator.next().value // Get final result

// Option 2: Access with observers
const { fullResponse } = await L.execute(chatCompletion, {
  observers: {
    onChunk: (chunk, accumulated) => updateUI(accumulated),
  },
})
```

### Example: Streaming Object Materialization

```ts
async function getStreamingReport() {
  const reportStream = L.stream(
    L.object({
      title: L.string,
      summary: L.string,
      data: L.array(L.object({
        id: L.number,
        value: L.string,
      })),
    }),
  )

  reportStream.subscribe((partialReport) => {
    // Update UI as the report materializes
    renderPartialReport(partialReport)
  })

  return await reportStream.value()
}
```

```ts
function* g() {
  const final = yield* L.$stream(
    L.object({
      a: L.string,
      b: L.string,
      c: L.string,
    }),
    (acc, chunk) => {},
  )
}
```
