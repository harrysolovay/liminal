import { _util, ActionBase, type JSONObject, type LanguageModelAdapter, type Message } from "liminal"
import type { Message as OllamaMessage, Ollama } from "ollama"

export function OllamaLanguageModel(ollama: Ollama, model: string): LanguageModelAdapter {
  return {
    adapter: "Language",
    reduceInference: async (scope, action) => {
      const { messages: liminalMessages } = scope
      const messages = liminalMessages.map(toOllamaMessage)
      if (action.type) {
        const schema = await _util.JSONSchemaMemo(action.type)
        const { message } = await ollama.chat({
          model,
          messages,
          format: schema,
        })
        const { content, tool_calls /* TODO */ } = message
        const object: JSONObject = JSON.parse(content)
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
      const { message: { content } } = await ollama.chat({
        model,
        messages,
      })
      scope.events.emit({
        event: "Inference",
        value: content,
      })
      return scope.spread({
        messages: [
          ...liminalMessages,
          ActionBase("AssistantMessage", { content }),
        ],
        next: content,
      })
    },
  }
}

function toOllamaMessage(message: Message): OllamaMessage {
  switch (message.action) {
    case "AssistantMessage": {
      return {
        role: "assistant",
        content: JSON.stringify(message.content),
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
        content: JSON.stringify(message.content),
      }
    }
    case "UserMessage": {
      return {
        role: "user",
        content: JSON.stringify(message.content),
      }
    }
  }
}
