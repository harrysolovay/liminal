import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1, tool } from "ai"
import { _util, type JSONValue, L, reduce, Scope } from "liminal"

export function AILanguageModel(model: LanguageModelV1): L.RunInfer {
  return async function*(action, scope) {
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
      const aiSchema = jsonSchema(schema)
      let { object } = await generateObject({
        model,
        messages,
        schema: aiSchema,
        mode: "json",
      })
      if (!isRoot) {
        object = (object as { value: object }).value
      }
      yield* L.assistant(JSON.stringify(object, null, 2))
      return object
    }
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
    //             args: params as JSONValue,
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
    //             result: result as JSONValue,
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
    yield* L.assistant(text)
    return text
  }
}

function toCoreMessage(message: L.Message): CoreMessage {
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
