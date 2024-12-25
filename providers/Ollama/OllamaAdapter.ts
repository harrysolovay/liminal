import { assert } from "@std/assert"
import type { Message, Ollama, Options } from "ollama"
import { type Adapter, DEFAULT_INSTRUCTIONS } from "../../client/mod.ts"
import { transform } from "../provider_common.ts"

export interface OllamaProvider {
  M: string
  I: Message
  O: Message
  E: Options
}

export function OllamaAdapter({
  ollama,
  defaultModel,
  defaultInstruction = DEFAULT_INSTRUCTIONS,
}: {
  ollama: Ollama
  defaultModel: string
  defaultInstruction?: string
}): Adapter<OllamaProvider> {
  return {
    transform,
    formatInput: (content) => ({
      role: "user",
      content,
    }),
    unwrapOutput: (message) => {
      assert(message.role === "assistant")
      return message.content
    },
    complete: ({ type, messages, model, options }) => {
      model ??= defaultModel
      if (!messages || !messages.length) {
        messages = [{
          role: "system",
          content: defaultInstruction,
        }]
      }
      return ollama.chat({
        model,
        messages,
        format: type.schema(),
        stream: false,
        options,
      }).then((v) => v.message)
    },
  }
}
