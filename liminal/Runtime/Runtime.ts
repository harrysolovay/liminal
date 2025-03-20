import type { Action } from "../Action/Action.js"
import { generateObject, generateText, type CoreMessage, jsonSchema } from "ai"
import { toJSONSchema } from "standard-json-schema"
import { openai } from "@ai-sdk/openai"
import type { FlowLike } from "../common/FlowLike.js"
import type { DeferredOr } from "../util/DeferredOr.js"

const model = openai("gpt-4o-mini")

export async function* iter<Y extends Action, T>(
  flow: DeferredOr<FlowLike<Y, T>>,
  system?: string,
): AsyncGenerator<Y, T> {
  let instance: FlowLike<Y, T>
  const messages: Array<CoreMessage> = []
  if (typeof flow === "function") {
    instance = flow()
  } else {
    instance = flow
  }
  let next: unknown = undefined
  while (true) {
    const current = await instance.next(next)
    if (current.done) {
      return current.value as T
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
        next = yield* iter(action.implementation, action.description) as any
        break
      }
    }
  }
}
