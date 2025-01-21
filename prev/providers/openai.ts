import type OpenAI from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import { type Model, Type } from "../../mod.ts"
import { assert } from "../../util/assert.ts"

export function model(openai: OpenAI, model: (string & {}) | ChatModel): Model {
  return {
    kind: "Model",
    complete: async (type, system, messages) => {
      const response_format = type.self() === Type.string ? undefined : {
        type: "json_schema" as const,
        json_schema: {
          name: "TODO",
          schema: type.schema(),
          strict: true,
        },
      }
      const { choices, created } = await openai.chat.completions.create({
        model,
        messages: [
          ...system
            ? [{
              role: "system" as const,
              content: system,
            }]
            : [],
          ...messages.map(({ role, body }) => ({
            role,
            content: [{
              type: "text" as const,
              text: body,
            }],
          })),
        ],
        response_format,
      })
      const [choice0] = choices
      assert(choice0 !== undefined)
      const { message } = choice0
      assert(typeof message.content === "string")
      return {
        role: "assistant",
        body: message.content,
        created: new Date(created * 1000),
      }
    },
  }
}
