import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1 } from "ai"
import { _util, ActionBase, type JSONObject, type LanguageModelAdapter, type Message } from "liminal"

export function AILanguageModel(model: LanguageModelV1): LanguageModelAdapter {
  return {
    adapter: "Language",
    reduceInference: async (scope, action) => {
      const { messages: liminalMessages } = scope
      const messages = liminalMessages.map(toCoreMessage)
      if (action.type) {
        const schema = await _util.JSONSchemaMemo(action.type)
        const aiSchema = jsonSchema(schema)
        const { object } = await generateObject({
          model,
          messages,
          schema: aiSchema,
        })
        scope.events.emit({
          event: "Inference",
          value: object as JSONObject,
          schema,
        })
        return scope.spread({
          messages: [
            ...liminalMessages,
            ActionBase("AssistantMessage", {
              content: JSON.stringify(object, null, 2),
            }),
          ],
          next: object,
        })
      }
      const { text } = await generateText({
        model,
        messages,
      })
      scope.events.emit({
        event: "Inference",
        value: text,
      })
      return scope.spread({
        messages: [
          ...liminalMessages,
          ActionBase("AssistantMessage", {
            content: text,
          }),
        ],
        next: text,
      })
    },
  }
}

function toCoreMessage(message: Message): CoreMessage {
  switch (message.action) {
    case "AssistantMessage": {
      return {
        role: "assistant",
        content: message.content,
      }
    }
    case "SystemMessage": {
      return {
        role: "system",
        content: message.content,
      }
    }
    case "ToolMessage": {
      return {
        role: "tool",
        content: message.content,
      }
    }
    case "UserMessage": {
      return {
        role: "user",
        content: message.content,
      }
    }
  }
}
