import { LiminalAssertionError, Model, Schema } from "liminal"
import { OpenAI } from "openai"
import type { ResponsesModel } from "openai/resources.mjs"
import type { ResponseInputContent, ResponseInputItem } from "openai/resources/responses/responses.js"

export interface AdapterConfig {
  client?: OpenAI
}

export function adapter(model: ResponsesModel, config?: AdapterConfig): Model {
  return new Model(
    "openai",
    ({ messages, schema, signal }) => {
      return {
        async resolve() {
          const response = await (config?.client ?? new OpenAI()).responses.create({
            input: messages.map((m): ResponseInputItem => ({
              role: m.role,
              content: m.parts.map((c): ResponseInputContent => ({
                type: m.role === "assistant" ? "output_text" as never : "input_text",
                text: String(c.part),
              })),
            })),
            model,
            ...schema && {
              text: {
                format: {
                  type: "json_schema",
                  name: await Schema.id(schema),
                  schema: schema as never as Record<string, unknown>,
                },
              },
            },
          }, { signal })
          const { output } = response
          const [message] = output
          LiminalAssertionError.assert(message?.type === "message")
          const [content] = message.content
          LiminalAssertionError.assert(content?.type === "output_text")
          return content.text
        },
        stream() {
          LiminalAssertionError.unimplemented()
        },
      }
    },
  )
}
