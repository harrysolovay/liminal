import type { ChatCompletion } from "openai/resources/chat/completions"
import type { Type } from "../../core/mod.ts"
import { recombine } from "../../util/mod.ts"
import { unwrapCompletion, unwrapOutput } from "./openai_util.ts"

export interface OpenAIResponseFormat<T> extends OpenAIFinalResponseFormat<T> {
  (template: TemplateStringsArray, ...values: Array<number | string>): OpenAIFinalResponseFormat<T>
}

export interface OpenAIFinalResponseFormat<T> {
  type: "json_schema"
  json_schema: {
    name: string
    description?: string
    schema: Record<string, unknown>
    strict: true
  }
  deserialize: (completion: ChatCompletion) => T
  toJSON(): Pick<OpenAIFinalResponseFormat<T>, "type" | "json_schema">
}

export function OpenAIResponseFormat<T>(name: string, type: Type<T>): OpenAIResponseFormat<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: Array<number | string>) =>
      OpenAIFinalResponseFormat(name, type, recombine(template, values)),
    OpenAIFinalResponseFormat(name, type),
  )
}

function OpenAIFinalResponseFormat<T>(
  name: string,
  type: Type<T>,
  description?: string,
): OpenAIFinalResponseFormat<T> {
  return {
    type: "json_schema",
    json_schema: {
      name,
      description,
      schema: type.schema(),
      strict: true,
    },
    deserialize: (completion: ChatCompletion): T =>
      type.deserialize(unwrapOutput(unwrapCompletion(completion))),
    toJSON() {
      const { type, json_schema } = this
      return { type, json_schema }
    },
  }
}
