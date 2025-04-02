import { assistant } from "../../actions/AssistantMessage.ts"
import type { RunInfer } from "../../actions/SetLanguageModel.ts"
import type { JSONValue } from "../../util/JSONValue.ts"

export interface TestLanguageModelConfig {
  getObject: () => JSONValue
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
