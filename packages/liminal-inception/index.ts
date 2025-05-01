import { LiminalAssertionError, Model } from "liminal"
import { env } from "node:process"

export type InceptionModel = "mercury-coder-small"

export interface AdapterConfig {
  INCEPTION_API_KEY?: string
}

export function adapter(model: InceptionModel, config?: AdapterConfig): Model {
  return new Model(
    "openai",
    ({ messages, signal }) => {
      return {
        async resolve() {
          const apiKey = config?.INCEPTION_API_KEY ?? env.INCEPTION_API_KEY
          const messages_ = messages.map((message) => ({
            role: message.role,
            content: message.parts.map((c) => c.part.toString()).join("\n\n"),
          }))
          const data = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: model,
              messages: messages_,
            }),
            signal,
          }).then((v) => v.json())
          LiminalAssertionError.assert("choices" in data)
          const { choices } = data
          LiminalAssertionError.assert(Array.isArray(choices))
          const [e0] = choices
          LiminalAssertionError.assert(typeof e0 === "object")
          LiminalAssertionError.assert("finish_reason" in e0)
          LiminalAssertionError.assert(e0.finish_reason === "stop")
          LiminalAssertionError.assert("message" in e0)
          const { message } = e0
          LiminalAssertionError.assert(typeof message === "object")
          LiminalAssertionError.assert("content" in message)
          const { content } = message
          LiminalAssertionError.assert(typeof content === "string")
          return content
        },
        stream() {
          LiminalAssertionError.unimplemented()
        },
      }
    },
  )
}
