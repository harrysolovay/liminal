import type { Message } from "@effect/ai/AiInput"
import type { LEvent } from "./LEvent.ts"

const GRAY = "\x1b[90m"
const RESET = "\x1b[0m"
const BOLD = "\x1b[1m"
const GRAY_BG = "\x1b[47m"

export const event: (event: typeof LEvent["Type"]) => string = (event) => {
  let text = `${GRAY}${event._tag}${RESET}`
  switch (event._tag) {
    case "MessagesAppended": {
      text += event.messages.map(message).join("\n")
      break
    }
    case "MessagesCleared": {
      text += `\n${event.cleared.length} messages cleared.`
      break
    }
  }
  return text
}

export const message = ({ _tag, parts }: Message): string => {
  let value = ""
  for (const part of parts) {
    value += `\n${BOLD}${_tag}\n${GRAY_BG}`
    switch (part._tag) {
      case "TextPart": {
        value += `${part.text}`
        break
      }
      default: {
        value += `${JSON.stringify(part, null, 2)}`
        break
      }
    }
    value += RESET
  }
  return value
}
