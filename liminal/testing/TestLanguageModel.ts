import { assistant } from "../AssistantMessage/Assistant.ts"
import type { JSONObject } from "../JSON/JSONObject.ts"
import type { InferenceActor } from "../SetLanguageModel/SetLanguageModel.ts"

export interface TestLanguageModelConfig {
  getObject: () => JSONObject
  getText: () => string
}

export const defaultTestLanguageModelConfig: TestLanguageModelConfig = {
  getObject: () => ({}),
  getText: () => "",
}

export function TestLanguageModel({
  getObject,
  getText,
}: TestLanguageModelConfig = defaultTestLanguageModelConfig): InferenceActor {
  return async function*(_scope, action) {
    if (action.type) {
      const object = getObject()
      yield* assistant(JSON.stringify(object))
      return object
    }
    const text = getText()
    yield* assistant(text)
    return text
  }
}
