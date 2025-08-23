import type { Message } from "@effect/ai/AiInput"
import type { LEvent } from "./LEvent.ts"

const GRAY = "\x1b[90m"
const RESET = "\x1b[0m"
const BOLD = "\x1b[1m"

export const event: (event: typeof LEvent["Type"]) => string = (event) => {
  let text = `${GRAY}${event._tag}${RESET}\n`
  switch (event._tag) {
    case "messages_appended": {
      text += event.messages.map(message).join("\n")
      break
    }
    case "messages_cleared": {
      text += "messages cleared."
      break
    }
    case "system_set": {
      text += `system set: ${event.system}.`
      break
    }
  }
  return text
}

export const message = ({ _tag, parts }: Message): string => {
  let value = ""
  for (const part of parts) {
    value += `\n${BOLD}${_tag}${RESET}\n`
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
