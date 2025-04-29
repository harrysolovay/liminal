import { LiminalAssertionError, Model } from "liminal"
import { type Message, Ollama } from "ollama"

export function adapter(model: string, client: Ollama = new Ollama()): Model {
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
                  LiminalAssertionError.assert(typeof c.part === "string")
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
          LiminalAssertionError.unimplemented()
        },
      }
    },
  )
}
