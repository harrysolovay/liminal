import { ActionBase } from "../Action/ActionBase.ts"
import type { LanguageModelAdapter } from "../Adapters.ts"
import type { JSONObject } from "../JSON/JSONObject.ts"
import { JSONSchemaMemo } from "../util/JSONSchemaMemo.ts"

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
    type: "Language",
    reduceInference: async (scope, action) => {
      if (action.type) {
        const object = getObject()
        scope.events.emit({
          type: "inferred",
          value: object,
        })
        return scope.spread({
          messages: [
            ...scope.messages,
            ActionBase("assistant_message", {
              content: JSON.stringify(object, null, 2),
            }),
          ],
          next: object,
        })
      }
      const text = getText()
      scope.events.emit({
        type: "inferred",
        value: text,
      })
      return scope.spread({
        ...scope,
        messages: [
          ...scope.messages,
          ActionBase("assistant_message", {
            content: text,
          }),
        ],
        next: text,
      })
    },
  }
}
