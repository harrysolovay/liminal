import { setMessages } from "../../actions/setMessages.ts"
import type { MessagesSet } from "../../events/MessagesSet.ts"

export function clear() {
  return setMessages(() => [])
}
