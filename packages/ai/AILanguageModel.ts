import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1 } from "ai"
import { _util, ActionBase, type JSONObject, type LanguageModelAdapter, type Message } from "liminal"

export function AILanguageModel(model: LanguageModelV1): LanguageModelAdapter {
  return async (state, action) => {
    const { messages: liminalMessages, system } = state
    const messages = liminalMessages.map(toCoreMessage)
    if (action.type) {
      const schema = await _util.JSONSchemaMemo(action.type)
      const aiSchema = jsonSchema(schema)
      const { object } = await generateObject({
        system,
        model,
        messages,
        schema: aiSchema,
      })
      state.events.emit({
        event: "Generation",
        value: object as JSONObject,
        schema,
      })
      return {
        ...state,
        messages: [
          ...liminalMessages,
          ActionBase("AssistantMessage", {
            content: JSON.stringify(object, null, 2),
          }),
        ],
        next: object,
      }
    }
    const { text } = await generateText({
      system,
      model,
      messages,
    })
    state.events.emit({
      event: "Generation",
      value: text,
    })
    return {
      ...state,
      messages: [
        ...liminalMessages,
        ActionBase("AssistantMessage", {
          content: text,
        }),
      ],
      next: text,
    }
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
