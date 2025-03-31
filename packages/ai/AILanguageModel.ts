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
    type: "Language",
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
          type: "inferred",
          value: object as JSONObject,
          schema,
        })
        const content = JSON.stringify(object, null, 2)
        scope.events.emit({
          type: "assistant_messaged",
          content,
        })
        return scope.spread({
          messages: [
            ...liminalMessages,
            ActionBase("assistant_message", { content }),
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
                  type: "tool_entered",
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
                        type: "tool_inner",
                        tool: tool_.key,
                        inner: event,
                      })),
                      { ...scope.model },
                    ),
                  )
                  result = toolScope.result
                }
                scope.events.emit({
                  type: "tool_exited",
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
        type: "inferred",
        value: text,
      })
      scope.events.emit({
        type: "assistant_messaged",
        content: text,
      })
      return scope.spread({
        messages: [
          ...liminalMessages,
          ActionBase("assistant_message", {
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
