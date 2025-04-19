import type { Message } from "./Message.ts"
import type { ModelRegistry } from "./ModelRegistry.ts"

export interface AgentConfig {
  messages?: Array<Message>
  models?: ModelRegistry
}
