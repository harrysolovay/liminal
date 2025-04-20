import { assert } from "liminal-util"
import { env } from "node:process"
import type { Model } from "../Model.ts"

export type OpenAIModel = "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo"

export function openai(model: OpenAIModel): Model {
  return {
    async resolve(messages, schema) {
      const response = await fetch(RESPONSES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          input: messages,
          ...schema && {
            text: {
              format: {
                type: "json_schema",
                name: "TODO",
                schema,
              },
            },
          },
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
