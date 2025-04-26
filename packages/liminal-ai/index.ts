import {
  type CoreMessage,
  generateObject,
  generateText,
  jsonSchema,
  type LanguageModelV1,
  streamObject,
  streamText,
  tool as aiTool,
} from "ai"
import { type Message, Model, ToolRegistryContext } from "liminal"
import { assert } from "liminal-util"

export function adapter(model: LanguageModelV1): Model {
  return new Model(
    "ai-sdk",
    ({ messages, schema: lSchema, signal }) => {
      const tools = Object.fromEntries(
        ToolRegistryContext.get()?.values()
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
      const schema = lSchema ? jsonSchema(lSchema) : undefined
      const toolConfig = {
        tools,
        maxSteps: Infinity,
      }
      const common = {
        model,
        messages: messages.map(toCoreMessage),
        ...signal && { abortSignal: signal },
      }
      return {
        resolve() {
          return schema
            ? generateObject({ ...common, schema }).then((value) => JSON.stringify(value.object))
            : generateText({ ...common, ...toolConfig }).then((v) => v.text)
        },
        stream() {
          return schema
            ? streamObject({ ...common, schema }).textStream
            : streamText({ ...common, ...toolConfig }).textStream
        },
      }
    },
  )
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
