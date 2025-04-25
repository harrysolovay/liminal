import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1, tool as aiTool } from "ai"
import { Context, type Message, Model, ToolRegistryContext } from "liminal"
import { assert } from "liminal-util"

export function ai(model: LanguageModelV1): Model {
  return new Model("ai-sdk", async (messages, schema) => {
    const context = Context.ensure()
    const tools = Object.fromEntries(
      context
        .get(ToolRegistryContext)
        ?.values()
        .map((tool) => [
          tool.name,
          aiTool({
            type: "function",
            description: tool.description,
            parameters: jsonSchema(tool.parameterSchema),
            execute(a) {
              return tool.f(a) as never
            },
          }),
        ])
        .toArray() ?? [],
    )
    if (schema) {
      const response = await generateObject({
        model,
        messages: messages.map(toCoreMessage),
        schema: jsonSchema(schema),
      })
      return JSON.stringify(response.object)
    }
    const response = await generateText({
      model,
      messages: messages.map(toCoreMessage),
      tools,
      maxSteps: Infinity,
    })
    return response.text
  })
}

// TODO: handle other content types
function toCoreMessage(message: Message): CoreMessage {
  return {
    role: message.role,
    content: message.content
      .map((c) => {
        assert(typeof c.part === "string")
        return c.part
      })
      .join("\n"),
  }
}
