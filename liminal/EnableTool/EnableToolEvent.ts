import type { ActionEvent } from "../Action/ActionEvent.ts"
import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { ToolResult } from "./ToolResult.ts"

export interface ToolEnabledEvent<K extends keyof any = keyof any> extends ActionEventBase<"tool_enabled"> {
  key: K
  description: string
  schema: object
}

export interface ToolEnteredEvent<K extends keyof any = keyof any, A extends JSONValue = JSONValue>
  extends ActionEventBase<"tool_entered">
{
  tool: K
  args: A
}

export interface ToolInnerEvent<K extends keyof any = keyof any, E extends ActionEvent = ActionEvent>
  extends ActionEventBase<"tool_inner">
{
  tool: K
  inner: E
}

export interface ToolExitedEvent<K extends keyof any = keyof any, T extends ToolResult = ToolResult>
  extends ActionEventBase<"tool_exited">
{
  tool: K
  result: T
}
