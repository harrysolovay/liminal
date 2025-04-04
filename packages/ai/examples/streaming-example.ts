import type { StandardSchemaV1 } from "@standard-schema/spec"
import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1 } from "ai"
import { type _util, type ActionEvent, ActionEvents, L, type Message, reduce, type RunInfer, Scope } from "liminal"
import { AILanguageModelWithStreaming } from "../AILanguageModelWithStreaming"

// Define a schema for a user object
const userSchema: StandardSchemaV1<_util.JSONValue, _util.JSONValue> = {
  "~standard": {
    version: 1,
    vendor: "liminal",
    validate: async (value: unknown) => {
      if (typeof value === "object" && value !== null) {
        const obj = value as Record<string, unknown>
        if (
          typeof obj.name === "string"
          && typeof obj.age === "number"
          && typeof obj.email === "string"
        ) {
          return { value: obj as _util.JSONValue }
        }
      }
      return {
        issues: [
          {
            message: "Invalid user object",
          },
        ],
      }
    },
  },
}

// Example usage of streaming functionality
export async function streamingExample(model: LanguageModelV1) {
  // Create a model with streaming support
  const { runInfer, runInferStream } = AILanguageModelWithStreaming(model)

  // Define the actor function
  async function* actor() {
    // Set up the language model
    yield* L.setLanguageModel("default", runInfer)

    // Add system message
    yield* L.system("You are a helpful assistant that generates user data.")

    // Add user message
    yield* L.user("Generate a user profile with name, age, and email.")

    // Perform streaming inference with progress updates
    const result = yield* L.infer(userSchema)

    console.log("Final result:", result)
  }

  // Run the actor
  const events = new ActionEvents((event: ActionEvent) => event, undefined)
  const scope = new Scope({}, undefined, events)
  const iterator = reduce(actor(), scope)
  for await (const message of iterator) {
    console.log("Message:", message)
  }
}

// Example usage:
// streamingExample(yourLanguageModel)
