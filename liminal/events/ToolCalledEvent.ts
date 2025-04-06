import type { JSONValue } from "../util/JSONValue.ts"
import type { EventBase } from "./_EventBase.ts"

export interface ToolCalledEvent<A extends JSONValue = JSONValue> extends EventBase<"tool_called"> {
  args: A
}
