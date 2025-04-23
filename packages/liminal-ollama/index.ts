import type { Model } from "liminal"
import { assert } from "liminal-util"
import { type Message, Ollama } from "ollama"

export function ollama(model: string, client: Ollama = new Ollama()): Model {
  return {
    async resolve(messages, schema) {
      const { message } = await client.chat({
        messages: messages.map((m): Message => ({
          role: m.role,
          content: m.content
            .map((c) => {
              assert(typeof c.part === "string")
              return c.part
            })
            .join("\n"),
        })),
        model,
        ...schema && { format: schema },
      })
      return message.content
    },
  }
}
