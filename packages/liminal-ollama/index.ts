import { Model } from "liminal"
import { assert, unimplemented } from "liminal-util"
import { type Message, Ollama } from "ollama"

export function ollama(model: string, client: Ollama = new Ollama()): Model {
  return new Model(
    "ollama",
    ({ messages, schema }) => {
      return {
        async resolve() {
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
        stream() {
          unimplemented()
        },
      }
    },
  )
}
