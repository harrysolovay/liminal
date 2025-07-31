import type { AiInput } from "@effect/ai"
import { Console, flow } from "effect"
import type { LEvent } from "liminal"

const formatLEvent: (event: LEvent) => string = (event) => {
  switch (event._tag) {
    case "MessageAppended": {
      return formatMessage(event.message)
    }
    case "MessagesConcatenated": {
      return ""
    }
    case "MessagesReduced": {
      return `Reduced ${event.messages}`
    }
  }
}

const GRAY = "\x1b[90m"
const RESET = "\x1b[0m"

const formatMessage = ({ _tag, parts }: AiInput.Message) => {
  let value = ""
  for (const part of parts) {
    value += `${GRAY}${_tag}${RESET}`
    switch (part._tag) {
      case "TextPart": {
        value += `\n${part.text}`
        break
      }
      default: {
        value += `\n${JSON.stringify(part, null, 2)}`
        break
      }
    }
  }
  return `${value}\n`
}

export const logLEvent = flow(formatLEvent, Console.log)
