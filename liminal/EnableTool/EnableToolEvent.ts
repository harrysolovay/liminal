import type { ActionEvent } from "../Action/ActionEvent.js"
import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { ToolResult } from "./ToolResult.js"

export interface ToolEnabledEvent<K extends keyof any = keyof any> extends ActionEventBase<"tool_enabled"> {
  key: K
  description: string
  schema: object
}

export interface ToolEnteredEvent<K extends keyof any = keyof any, A extends JSONObject = JSONObject>
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
