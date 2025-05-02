import { LiminalAssertionError, Model } from "liminal"
import { type Message, Ollama } from "ollama"

/**
 * A Liminal adapter for Ollama.
 * @param model The name of the Ollama model to use
 * @param client Optional Ollama client instance (creates a new one if not provided)
 * @returns A Liminal Model that can be used with the Liminal runtime
 */
export function adapter(model: string, client: Ollama = new Ollama()): Model {
  return new Model(
    "ollama",
    ({ messages, schema }) => {
      return {
        async resolve() {
          const { message } = await client.chat({
            messages: messages.map((m): Message => ({
              role: m.role,
              content: m.parts
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
          return new ReadableStream({
            async start(controller) {
              try {
                const response = await client.chat({
                  messages: messages.map((m): Message => ({
                    role: m.role,
                    content: m.parts
                      .map((c) => {
                        LiminalAssertionError.assert(typeof c.part === "string")
                        return c.part
                      })
                      .join("\n"),
                  })),
                  model,
                  ...schema && { format: schema },
                  stream: true,
                })
                for await (const chunk of response) {
                  controller.enqueue(chunk.message.content)
                }
                controller.close()
              } catch (error) {
                controller.error(error)
              }
            },
          })
        },
      }
    },
  )
}
