import {
  type CoreMessage,
  generateObject,
  generateText,
  jsonSchema,
  type LanguageModelV1,
  tool as aiTool,
  type ToolSet,
} from "ai"
import { _util, L, type Message, type RunInfer } from "liminal"

export function AILanguageModel(model: LanguageModelV1): RunInfer {
  return async function*(type) {
    const messages = yield* L.getMessages()
    const coreMessages = messages.map(toCoreMessage)
    if (type) {
      const schema = await _util.JSONSchemaMemo(type)
      let { object } = await generateObject({
        model,
        messages: coreMessages,
        schema: jsonSchema(schema),
      })
      yield* L.assistant(JSON.stringify(object, null, 2))
      const validateResult = await type["~standard"].validate(object)
      _util.assert(!validateResult.issues)
      return validateResult.value
    }
    const scope = yield* L.getScope()
    const aiTools: ToolSet = await Promise
      .all(
        scope.tools.values().map(async (tool) => {
          return [
            tool.key,
            aiTool({
              type: "function",
              description: tool.description,
              parameters: jsonSchema(await _util.JSONSchemaMemo(tool.params)),
              execute: tool.executor(scope),
            }),
          ] as const
        }),
      )
      .then(Object.fromEntries)
    const { text } = await generateText({
      model,
      messages: coreMessages,
      tools: aiTools,
    })
    yield* L.assistant(text)
    return text
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
