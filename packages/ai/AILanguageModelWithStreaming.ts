import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1, tool } from "ai"
import { _util, L, type Message, reduce, type RunInfer, Scope } from "liminal"
import type { InferStream, RunInferStream } from "liminal"
import { AILanguageModel } from "./AILanguageModel.ts"

// Helper function to parse potentially incomplete JSON
function parsePartialJson(text: string): any {
  try {
    return JSON.parse(text)
  } catch (e) {
    // Try to fix incomplete JSON
    const fixed = fixIncompleteJson(text)
    try {
      return JSON.parse(fixed)
    } catch (e) {
      return null
    }
  }
}

function fixIncompleteJson(text: string): string {
  // Balance brackets and quotes
  // This is a simplified version - in production you'd use a more robust approach

  let fixed = text
  const openBraces = (text.match(/{/g) || []).length
  const closeBraces = (text.match(/}/g) || []).length

  // Add missing closing braces
  for (let i = 0; i < openBraces - closeBraces; i++) {
    fixed += "}"
  }

  return fixed
}

function toCoreMessage(message: Message): CoreMessage {
  switch (message.action) {
    case "assistant_message": {
      return {
        role: "assistant",
        content: message.content,
      }
    }
    case "system_message": {
      return {
        role: "system",
        content: message.content,
      }
    }
    case "tool_message": {
      return {
        role: "tool",
        content: message.content,
      }
    }
    case "user_message": {
      return {
        role: "user",
        content: message.content,
      }
    }
  }
}

// Extended LanguageModelV1 type to include streaming methods
interface StreamingLanguageModelV1 extends LanguageModelV1 {
  generateObjectStream?: (params: any) => Promise<AsyncIterableIterator<{ text: string }>>
  generateTextStream?: (params: any) => Promise<AsyncIterableIterator<{ text: string }>>
}

export function AILanguageModelWithStreaming(model: StreamingLanguageModelV1): {
  runInfer: RunInfer
  runInferStream: RunInferStream
} {
  // Existing implementation for runInfer
  const regularInfer = AILanguageModel(model)

  // New implementation for streaming
  const streamingInfer: RunInferStream = (
    action: InferStream,
    scope: Scope,
    progressCallback: (partial: any) => void,
  ) => {
    return async function*() {
      const { messages: liminalMessages } = scope
      const messages = liminalMessages.map(toCoreMessage)

      if (action.type) {
        let schema = await _util.JSONSchemaMemo(action.type)
        const isRoot = "type" in schema && schema.type === "object"

        if (!isRoot) {
          schema = {
            type: "object",
            fields: {
              value: schema,
            },
            required: ["value"],
          }
        }

        // Check if model supports streaming
        if (model.generateObjectStream) {
          try {
            const aiSchema = jsonSchema(schema)
            const stream = await model.generateObjectStream({
              messages,
              schema: aiSchema,
              mode: "json",
            })

            let partialObject = {}
            let lastValidObject = {}

            for await (const chunk of stream) {
              try {
                // Try to parse the chunk, which might be incomplete JSON
                const parsed = parsePartialJson(chunk.text || "")
                if (parsed) {
                  partialObject = parsed
                  lastValidObject = parsed
                  progressCallback(partialObject)
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }

            // Use the last valid object as the final result
            const finalObject = isRoot ? lastValidObject : (lastValidObject as { value: any }).value
            yield* L.assistant(JSON.stringify(finalObject, null, 2))
            return finalObject
          } catch (error) {
            // Fallback to non-streaming if streaming fails
            return regularInfer(action as any, scope)
          }
        } else {
          // Fallback to regular inference if streaming not supported
          return regularInfer(action as any, scope)
        }
      } else {
        // Text generation
        if (model.generateTextStream) {
          try {
            const stream = await model.generateTextStream({
              messages,
            })

            let fullText = ""
            for await (const chunk of stream) {
              fullText += chunk.text
              progressCallback(fullText)
            }

            yield* L.assistant(fullText)
            return fullText
          } catch (error) {
            // Fallback to non-streaming
            return regularInfer(action as any, scope)
          }
        } else {
          // Fallback to non-streaming
          return regularInfer(action as any, scope)
        }
      }
    }()
  }

  return {
    runInfer: regularInfer,
    runInferStream: streamingInfer,
  }
}
