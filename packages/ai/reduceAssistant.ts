import { generateObject, generateText, jsonSchema, type CoreMessage, type LanguageModelV1 } from "ai"
import { _util, type ProviderReducers } from "liminal"
import { toJSONSchema } from "standard-json-schema"

export const reduceAssistant: ProviderReducers<LanguageModelV1, CoreMessage>["reduceAssistant"] = async (
  state,
  action,
) => {
  const { messages, system, modelKey } = state
  const model = state.models[modelKey]
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
      type: "Completion",
      value: object,
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
    type: "Completion",
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
