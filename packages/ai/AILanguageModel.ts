import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1, tool } from "ai"
import { _util, isType, L, type Message, type RunInfer, Scope } from "liminal"

export function AILanguageModel(model: LanguageModelV1): RunInfer {
  return async function*(action, scope) {
    const { messages: liminalMessages } = scope
    const messages = liminalMessages.map(toCoreMessage)
    if (action.type) {
      const schema = await _util.JSONSchemaMemo(action.type)
      let { object } = await generateObject({
        model,
        messages,
        schema: jsonSchema(schema),
      })
      yield* L.appendMessage({
        role: "assistant",
        content: JSON.stringify(object, null, 2),
      })
      return object
    }
    // TODO: reenable tools
    // const tools = await Promise.all(
    //   scope.tools.values().map(async (tool_) => {
    //     const schema = await _util.JSONSchemaMemo(tool_.params)
    //     return [
    //       tool_.key,
    //       tool({
    //         description: tool_.description,
    //         parameters: jsonSchema(schema),
    //         execute: async (params) => {
    //           scope.events.emit({
    //             type: "tool_entered",
    //             tool: tool_.key,
    //             args: params as _util.JSONValue,
    //           })
    //           let result = await tool_.implementation(params as never)
    //           if (_util.isIteratorLike(result)) {
    //             const actor = result as never
    //             const toolScope = await reduceActor(
    //               new Scope(
    //                 scope.args,
    //                 undefined,
    //                 scope.events.child((event) => ({
    //                   type: "tool_inner",
    //                   tool: tool_.key,
    //                   event: event,
    //                 })),
    //                 scope.infer,
    //                 scope.embed,
    //               ),
    //               actor,
    //             )
    //             result = toolScope.result
    //           }
    //           scope.events.emit({
    //             type: "tool_exited",
    //             tool: tool_.key,
    //             result: result as _util.JSONValue,
    //           })
    //           return result
    //         },
    //       }),
    //     ]
    //   }),
    // ).then(Object.fromEntries)
    const { text } = await generateText({
      model,
      messages,
      // tools,
    })
    yield* L.appendMessage({
      role: "assistant",
      content: text,
    })
    return text
  }
}

function toCoreMessage(message: Message): CoreMessage {
  switch (message.role) {
    case "assistant": {
      return {
        role: "assistant",
        content: message.content,
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
