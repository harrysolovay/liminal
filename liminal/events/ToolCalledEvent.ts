import type { EventBase } from "./_EventBase.ts"

export interface ToolCalledEvent<A = any> extends EventBase<"tool_called"> {
  args: A
}
