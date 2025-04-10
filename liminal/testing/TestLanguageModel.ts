import { assistant } from "../actions/actions_derived/messages.ts"
import type { LanguageModel } from "../Model.ts"
import type { JSONValue } from "../util/JSONValue.ts"

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
}: TestLanguageModelConfig = defaultTestLanguageModelConfig): LanguageModel {
  return {
    type: "language",
    vendor: "liminal_testing",
    async *infer(type) {
      if (type) {
        const object = getObject()
        yield* assistant`${JSON.stringify(object)}`
        return object
      }
      const text = getText()
      yield* assistant`${text}`
      return text
    },
  }
}
