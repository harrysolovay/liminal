# Eliminating Boilerplate

Traditional LLM clients and frameworks often require verbose boilerplate code
for managing conversations. Consider a typical scenario using a conventional LLM
client:

```typescript
// Traditional approach
const messages: Array<Message> = []

// Initial prompt
messages.push({
  role: "user",
  content: "Review this code for security issues",
})

const securityReview = await client.chat({
  messages: messages,
  model: "gpt-4",
})
messages.push(securityReview.message)

// Performance review
messages.push({
  role: "user",
  content: "Now review it for performance",
})

const performanceReview = await client.chat({
  messages: messages,
  model: "gpt-3.5-turbo",
})
messages.push(performanceReview.message)

// Manually manage state, branching, etc.
```

## The Liminal Approach

Instead of manually managing message buffers and state, Liminal lets you write
conversations as generator functions:

```typescript
function* codeReview(code: string) {
  yield* user`Review this code for security issues`
  const securityReview = yield* infer()
  yield* user`Now review it for performance`
  const performance = yield* infer()
}
```
