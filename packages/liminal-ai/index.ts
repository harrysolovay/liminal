import { type CoreMessage, generateObject, generateText, jsonSchema, type LanguageModelV1 } from "ai"
import { _util, type Message, type Model } from "liminal"
import { assert } from "liminal-util"

export function ai(model: LanguageModelV1): Model {
  return {
    async resolve(messages, schema) {
      if (schema) {
        const response = await generateObject({
          model,
          messages: messages.map((message) => toCoreMessage(message)),
          schema: jsonSchema(schema),
        })
        return JSON.stringify(response.object)
      }
      const response = await generateText({
        model,
        messages: messages.map((message) => toCoreMessage(message)),
      })
      return response.text
    },
  }
}

// TODO: handle other content types
function toCoreMessage(message: Message): CoreMessage {
  return {
    role: message.role,
    content: message.content
      .map((c) => {
        assert(typeof c.part === "string")
        return c.part
      })
      .join("\n"),
  }
}
