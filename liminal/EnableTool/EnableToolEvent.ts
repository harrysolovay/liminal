import type { ActionEvent } from "../Action/ActionEvent.ts"
import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export interface ToolEnabledEvent<K extends keyof any = keyof any> extends ActionEventBase<"tool_enabled"> {
  key: K
  description: string
  schema: object
}

export interface ToolEvent<K extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"tool">
{
  tool: K
  event: E
}

export interface ToolCalledEvent<A extends JSONValue = JSONValue> extends ActionEventBase<"tool_called"> {
  args: A
}
