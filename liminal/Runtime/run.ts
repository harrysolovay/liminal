import type { Action, Propagated } from "../Action/Action.js"
import { generateObject, generateText, type CoreMessage, jsonSchema, type LanguageModelV1 } from "ai"
import { toJSONSchema } from "standard-json-schema"
import { openai } from "@ai-sdk/openai"
import type { FlowLike } from "../common/FlowLike.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { Model } from "../Action/Requirement.js"
import type { Agent } from "../Action/Agent.js"

export async function* Exec<Y extends Action, T>(flow: DeferredOr<FlowLike<Y, T>>, modelConfig: ModelConfig<Y>) {
  yield* iter(flow)
}

export type ModelConfig<Y extends Action> = {
  default: LanguageModelV1
} & {
  [K in Extract<Y, Model>["key"] | Extract<Y, Agent>["M"]]: LanguageModelV1
}

const model = openai("gpt-4o-mini")

export async function* iter(flow: DeferredOr<FlowLike>, system?: string): AsyncGenerator<unknown, unknown> {
  const instance = typeof flow === "function" ? flow() : flow
  const messages: Array<CoreMessage> = []
  let next: unknown
  while (true) {
    const current = await instance.next(next)
    if (current.done) {
      return current.value
    }
    const action = current.value as Action
    if (typeof action === "string") {
      messages.push({
        role: "user",
        content: action,
      })
      continue
    }
    switch (action.kind) {
      case "E": {
        console.log(action)
        break
      }
      case "AssistantText": {
        const { text } = await generateText({
          system,
          model,
          messages,
        })
        next = text
        break
      }
      case "AssistantValue": {
        const schema = await toJSONSchema(action.type).then(jsonSchema)
        const { object } = await generateObject({
          system,
          model,
          messages,
          schema,
        })
        next = object
        break
      }
      case "Agent": {
        next = yield* iter(action.implementation, action.description)
        break
      }
    }
  }
}
