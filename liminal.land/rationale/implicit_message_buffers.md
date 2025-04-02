# Implicit Message Buffers

## Overview

Liminal introduces a powerful pattern for managing LLM conversations through
implicit message buffers. This approach integrates seamlessly with standard
function control flow, making it more natural and maintainable to work with LLM
conversations in your code.

## Why Implicit Message Buffers?

### Traditional Approach Challenges

Without Liminal, managing LLM conversations typically requires explicit message
list management:

```ts
declare const messages: Array<Message>

// Get the assistant's response
const { message } = await ollama.chat({
  model,
  messages,
})

// Manually update the message list
messages.push(message)
```

This explicit management becomes particularly cumbersome when:

- Handling multiple conversation branches
- Managing long-running conversations
- Implementing complex conversation logic
- Maintaining conversation state across function calls

### Example: Complex Conversation Branching

The traditional approach can become unwieldy:

```ts
const forkA = [...messages, {
  role: "user",
  content: "Rewrite for marketers.",
}]

const forkB = [...messages, {
  role: "user",
  content: "Rewrite for developers.",
}]

const forkC = [...messages, {
  role: "user",
  content: "Rewrite for recruiters.",
}]

const [
  { message: messageA },
  { message: messageB },
  { message: messageC },
] = await Promise.all([
  ollama.chat({
    model,
    messages: forkA,
  }),
  ollama.chat({
    model,
    messages: forkB,
  }),
  ollama.chat({
    model,
    messages: forkC,
  }),
])

// Manual message buffer updates
forkA.push(messageA)
forkB.push(messageB)
forkC.push(messageC)
```

## The Liminal Solution

Liminal simplifies this process by managing message buffers implicitly. Here's
how:

### Basic Usage

```ts
function* conversation() {
  // Send a user message
  yield* user`What is the weather like?`

  // Get assistant's response
  const reply = yield* infer()

  // Continue the conversation naturally
  yield* user`And what about tomorrow?`
  const nextReply = yield* infer()
}
```

### Benefits

1. **Simplified Control Flow**: Message management becomes part of your normal
   function flow
2. **Automatic Context Management**: No need to manually track or update message
   lists
3. **Clean Branching**: Easier to create and manage conversation branches
4. **Reduced Boilerplate**: Eliminates repetitive message list manipulation
5. **Better Maintainability**: Conversation logic is more readable and easier to
   modify

### Advanced Example: Conversation Branching

```ts
function* getContentVariations() {
  // Initial content generation
  yield* user`Generate a product description for our new AI tool.`
  const baseContent = yield* infer()

  // Create variations using generator functions
  const variations = yield* Promise.all([
    createVariation("marketers"),
    createVariation("developers"),
    createVariation("recruiters"),
  ])

  return variations
}

function* createVariation(audience: string) {
  yield* user`Rewrite the previous content for ${audience}.`
  return yield* infer()
}
```

## Implementation Details

The Liminal executor handles all the underlying complexity:

- Maintains the message buffer automatically
- Updates context after each inference
- Manages conversation state across generator function calls

This approach scales elegantly from simple conversations to complex,
multi-branched interactions while keeping your code clean and maintainable.
