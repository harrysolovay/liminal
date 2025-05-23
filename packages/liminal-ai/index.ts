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
import { Adapter, LiminalAssertionError, type Message } from "liminal"

export function adapter(model: LanguageModelV1): Adapter {
  return new Adapter(
    "ai-sdk",
    ({ messages, schema: lSchema, signal, tools: lTools }) => {
      const tools = Object.fromEntries(
        lTools
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
    content: message.parts
      .map((c) => {
        LiminalAssertionError.assert(typeof c.part === "string")
        return c.part
      })
      .join("\n"),
  }
}
