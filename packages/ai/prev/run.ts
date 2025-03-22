import { generateObject, generateText, type CoreMessage, jsonSchema } from "ai"
import { toJSONSchema } from "standard-json-schema"
import { openai } from "@ai-sdk/openai"
import { unwrapDeferred, type FlowLike, type Action } from "liminal"

const model = openai("gpt-4o-mini")

export async function* iter(flow: FlowLike, system?: string): AsyncGenerator<unknown, unknown> {
  const instance = unwrapDeferred(flow)
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
    } else if (Array.isArray(action)) {
      messages.push(
        ...action.map(
          (content) =>
            ({
              role: "user",
              content,
            }) satisfies CoreMessage,
        ),
      )
      continue
    }
    switch (action.kind) {
      case "Emit": {
        console.log(action)
        break
      }
      case "Assistant": {
        if (action.type) {
          const schema = await toJSONSchema(action.type).then(jsonSchema)
          const { object } = await generateObject({
            system,
            model,
            messages,
            schema,
          })
          next = object
        } else {
          const { text } = await generateText({
            system,
            model,
            messages,
          })
          next = text
        }
        break
      }
      case "Agent": {
        next = yield* iter(action.implementation, action.instructions)
        break
      }
    }
  }
}
