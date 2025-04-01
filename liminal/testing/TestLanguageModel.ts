import { assistant } from "../AssistantMessage/AssistantMessage.ts"
import type { JSONObject } from "../JSON/JSONObject.ts"
import type { RunInfer } from "../SetLanguageModel/SetLanguageModel.ts"

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
}: TestLanguageModelConfig = defaultTestLanguageModelConfig): RunInfer {
  return async function*(action) {
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
