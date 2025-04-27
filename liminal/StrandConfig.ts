import type { Fiber } from "./Fiber.ts"
import type { MessageRegistry } from "./MessageRegistry.ts"
import type { ModelRegistry } from "./ModelRegistry.ts"
import type { ToolRegistry } from "./ToolRegistry.ts"

export interface StrandConfig<T = any, E = any> {
  handler?: ((this: Fiber<T>, event: E) => void) | undefined
  models?: ModelRegistry | undefined
  messages?: MessageRegistry | undefined
  tools?: ToolRegistry | undefined
  signal?: AbortSignal | undefined
}
