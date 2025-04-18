import {
  type CoreMessage,
  generateObject,
  generateText,
  jsonSchema,
  type LanguageModelV1,
  streamObject,
  tool as aiTool,
  type ToolSet,
} from "ai"
import { _util, L, type LanguageModel, type Message } from "liminal"

export function AILanguageModel(model: LanguageModelV1): LanguageModel {
  return {
    type: "language",
    vendor: "vercel_ai_sdk",
    async *infer(type) {
      const messages = yield* L.messages
      const coreMessages = [...messages].map(toCoreMessage)
      if (type) {
        const schema = await _util.JSONSchemaMemo(type)
        let { object } = await generateObject({
          model,
          messages: coreMessages,
          schema: jsonSchema(schema),
        })
        yield* L.assistant(JSON.stringify(object, null, 2))
        // TODO: re-enable this
        // const validateResult = await type["~standard"].validate(object)
        // _util.assert(!validateResult.issues)
        // return validateResult.value
        return object
      }
      const scope = yield* L.scope
      const aiTools: ToolSet = await Promise
        .all(
          scope.tools.values().map(async (tool) =>
            [
              tool.toolKey,
              aiTool({
                type: "function",
                description: tool.description,
                parameters: jsonSchema(await _util.JSONSchemaMemo(tool.params)),
                execute: tool.executor(scope),
              }),
            ] as const
          ),
        )
        .then(Object.fromEntries)
      const { text } = await generateText({
        model,
        messages: coreMessages,
        tools: aiTools,
        maxSteps: Infinity, // TODO: remove this
      })
      yield* L.assistant(text)
      return text
    },
  }
}

function toCoreMessage(message: Message): CoreMessage {
  switch (message.role) {
    case "assistant": {
      return {
        role: "assistant",
        content: message.content.slice(),
      }
    }
    case "system": {
      return {
        role: "system",
        content: message.content,
      }
    }
    case "tool": {
      return {
        role: "tool",
        content: message.content,
      }
    }
    case "user": {
      return {
        role: "user",
        content: message.content,
      }
    }
  }
}
