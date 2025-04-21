import type { Model } from "liminal"
import { _util } from "liminal"
import { OpenAI } from "openai"
import type { ResponsesModel } from "openai/resources.mjs"
import type { ResponseInputContent, ResponseInputItem } from "openai/resources/responses/responses.js"

export function openai(model: ResponsesModel, client: OpenAI = new OpenAI()): Model {
  return {
    async resolve(messages, schema) {
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
              name: "TODO",
              schema: schema as never as Record<string, unknown>,
            },
          },
        },
      })
      const { output } = response
      const [message] = output
      _util.assert(message?.type === "message")
      const [content] = message.content
      _util.assert(content?.type === "output_text")
      return content.text
    },
  }
}
