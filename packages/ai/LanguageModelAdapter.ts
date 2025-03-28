import { generateObject, generateText, jsonSchema, type LanguageModelV1 } from "ai"
import { _util, type JSONObject, type LanguageModelAdapter } from "liminal"

export function LanguageModelAdapter(model: LanguageModelV1): LanguageModelAdapter {
  return async (state, action) => {
    const { messages, system } = state
    if (action.type) {
      const schema = await _util.JSONSchemaMemo(action.type)
      const aiSchema = jsonSchema(schema)
      const { object } = await generateObject({
        system,
        model,
        messages,
        schema: aiSchema,
      })
      state.handler({
        event: "Generation",
        value: object as JSONObject,
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
      event: "Generation",
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
}
