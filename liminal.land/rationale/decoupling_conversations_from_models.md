# Decoupling Conversations From Models

## Problem Statement

In traditional LLM application development, conversations are often tightly
coupled to specific model providers, model versions, or client libraries. This
coupling creates several challenges:

1. Vendor lock-in to specific LLM providers
2. Difficulty in comparing model performance
3. Complex migration paths when switching providers
4. Limited ability to compose multimodel workflows
5. Testing and development complexity when models are unavailable

## Solution: Model-Agnostic Conversation Design

Liminal addresses these challenges by allowing developers to model conversations
as provider-agnostic generators. Instead of directly instantiating model
clients, conversations declare their model requirements using abstract
identifiers. The actual model implementations are only bound during conversation
execution.

```ts
function* Conversation() {
  yield* declareLanguageModel("default")

  // Conversation logic independent of any specific model
  yield user`How are you today?`
  const reply = yield* infer()
  // ...
}
```

## Key Benefits

### Eliminating Vendor Lock-in

By decoupling conversation logic from specific model implementations,
applications can:

- Switch between different model providers without changing conversation logic
- Use different models in different environments (development, staging,
  production)
- Gracefully handle model deprecations or API changes

### Portability

Conversations modeled with Liminal can be:

- Shared between different applications
- Tested with mock models
- Versioned independently of models

### Model Comparison and Selection

Liminal's decoupled architecture enables patterns for model evaluation and
selection:

1. **Direct Comparison**: Run the same conversation with different models to
   compare outputs
2. **Meta-Selection**: Use one model to evaluate and select from the outputs of
   other models
3. **A/B Testing**: Easily implement production A/B tests between different
   models

Example of meta-selection pattern:

```ts
function* ab() {
  const options = yield* fork("variants", {
    *a() {
      yield* declareLanguageModel("a")
      return yield* conversation()
    },
    *b() {
      yield* declareLanguageModel("b")
      return yield* conversation()
    },
  })
  yield* user`
    Which is best? a or b?

    ${options}
  `
  const best = yield* infer(type("'a' | 'b'"))
  return options[best]
}

function* conversation() {
  // ...
}
```

### Libraries and Reusability

The decoupled architecture enables:

- Creation of reusable conversation components
- Sharing of conversation patterns between projects
- Building of model-agnostic conversation libraries

## Same Messages, Different Models

A key principle of Liminal is that the entire conversation history should be
compatible with any model at any point in time. This means:

1. Messages are stored in a model-agnostic format
2. Conversation state can be serialized and resumed with different models
3. Branching conversations can use different models while sharing context
4. Model-specific formatting or templating is handled at the execution layer
