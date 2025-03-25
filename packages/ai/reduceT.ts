import { generateObject, generateText, jsonSchema, type CoreMessage, type LanguageModelV1 } from "ai"
import { _util, type JSONValue, type ProviderReducers } from "liminal"
import { toJSONSchema } from "standard-json-schema"
import type { AIExecSpec } from "./AIExecSpec.js"

export const reduceT: ProviderReducers<AIExecSpec>["reduceT"] = async (state, action) => {
  const { messages, system, languageModelKey: modelKey } = state
  const model = state.config.models.language[modelKey]
  _util.assert(model)
  if (action.type) {
    const schema = await toJSONSchema(action.type)
    const aiSchema = jsonSchema(schema)
    const { object } = await generateObject({
      system,
      model,
      messages,
      schema: aiSchema,
    })
    state.handler({
      type: "T",
      value: object as JSONValue,
      schema,
    })
    return {
      ...state,
      messages: [
        ...state.messages,
        {
          role: "assistant",
          content: JSON.stringify(object, null, 2),
        },
      ],
      next: object,
    }
  }
  const { text } = await generateText({
    system,
    model,
    messages,
  })
  state.handler({
    type: "T",
    value: text,
  })
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        role: "assistant",
        content: text,
      },
    ],
    next: text,
  }
}
