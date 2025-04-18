import { assert } from "liminal-util"
import type { Provider } from "../Provider.ts"

export type OpenAIModel = "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo"

export function openai(model: OpenAIModel): Provider {
  return {
    async resolve(messages, schema) {
      const response = await fetch(RESPONSES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          input: messages,
          ...schema
            ? {
              type: "json_schema",
              schema,
            }
            : {},
        }),
      })
      const result = await response.json()
      assert("output" in result)
      const { output } = result
      const [message] = output
      assert(message)
      const [content] = message.content
      assert(content)
      return content.text
    },
  }
}

const RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses"
