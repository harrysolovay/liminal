import { ActionBase } from "../Action/ActionBase.js"
import type { LanguageModelAdapter } from "../Adapters.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.js"

export interface TestLanguageModelConfig {
  getObject: () => JSONObject
  getText: () => string
}

export const defaultTestLanguageModelConfig: TestLanguageModelConfig = {
  getObject: () => ({}),
  getText: () => "",
}

export function TestLanguageModel(
  { getObject, getText }: TestLanguageModelConfig = defaultTestLanguageModelConfig,
): LanguageModelAdapter {
  return {
    adapter: "Language",
    reduceInference: async (scope, action) => {
      if (action.type) {
        const schema = await JSONSchemaMemo(action.type)
        const object = getObject()
        scope.events.emit({
          event: "Inference",
          value: object,
          schema,
        })
        return scope.spread({
          messages: [
            ...scope.messages,
            ActionBase("AssistantMessage", {
              content: JSON.stringify(object, null, 2),
            }),
          ],
          next: object,
        })
      }
      const text = getText()
      scope.events.emit({
        event: "Inference",
        value: text,
      })
      return scope.spread({
        ...scope,
        messages: [
          ...scope.messages,
          ActionBase("AssistantMessage", {
            content: text,
          }),
        ],
        next: text,
      })
    },
  }
}
