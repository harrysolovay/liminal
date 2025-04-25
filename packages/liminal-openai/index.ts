import { Model } from "liminal"
import { Schema } from "liminal-schema"
import { assert, unimplemented } from "liminal-util"
import { OpenAI } from "openai"
import type { ResponsesModel } from "openai/resources.mjs"
import type { ResponseInputContent, ResponseInputItem } from "openai/resources/responses/responses.js"

export function openai(model: ResponsesModel, client: OpenAI = new OpenAI()): Model {
  return new Model(
    "openai",
    ({ messages, schema, signal }) => {
      return {
        async resolve() {
          const response = await client.responses.create({
            input: messages.map((m): ResponseInputItem => ({
              role: m.role,
              content: m.content.map((c): ResponseInputContent => ({
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
          assert(message?.type === "message")
          const [content] = message.content
          assert(content?.type === "output_text")
          return content.text
        },
        stream() {
          unimplemented()
        },
      }
    },
  )
}
