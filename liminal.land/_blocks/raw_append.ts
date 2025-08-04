import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
import { Message, TextPart, UserMessage } from "@effect/ai/AiInput"

declare const messages: Array<Message>

const conversation = Effect.gen(function*() {
  // Append a list of messages.
  yield* L.append(...messages)

  // Or append a single message.
  yield* L.append(
    UserMessage.make({
      parts: [
        TextPart.make({ text: "..." }),
      ],
    }),
  )
})
