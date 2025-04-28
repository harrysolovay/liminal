import { State } from "../Context.ts"
import { MessageRegistry } from "../MessageRegistry.ts"

export const messages = State<MessageRegistry>((parent) =>
  new MessageRegistry(...(parent?.messages ? [parent.messages] : []))
)
