import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1, tool } from "ai"
import {
  _util,
  ActionBase,
  type JSONObject,
  type LanguageModelAdapter,
  type Message,
  reduceActor,
  Scope,
} from "liminal"

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
          type: "Inference",
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
      const tools = await Promise.all(
        scope.tools.values().map(async (tool_) => {
          const schema = await _util.JSONSchemaMemo(tool_.params)
          return [
            tool_.key,
            tool({
              description: tool_.description,
              parameters: jsonSchema(schema),
              execute: async (params) => {
                scope.events.emit({
                  type: "ToolEnter",
                  tool: tool_.key,
                  args: params as JSONObject,
                })
                let result = await tool_.implementation(params as never)
                if (_util.isIteratorLike(result)) {
                  const toolScope = await reduceActor(
                    new Scope(
                      scope.models,
                      undefined,
                      result as never,
                      scope.events.child((event) => ({
                        type: "ToolInner",
                        tool: tool_.key,
                        inner: event,
                      })),
                      { ...scope.model },
                    ),
                  )
                  result = toolScope.result
                }
                scope.events.emit({
                  type: "ToolExit",
                  tool: tool_.key,
                  result: result as JSONObject,
                })
                return result
              },
            }),
          ]
        }),
      ).then(Object.fromEntries)
      const { text } = await generateText({
        model,
        messages,
        tools,
      })
      scope.events.emit({
        type: "Inference",
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
