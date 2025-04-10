import type { MessagesSet } from "../../events/MessagesSet.ts"
import { messages } from "../messages.ts"

export function clear() {
  return messages(() => [])
}
