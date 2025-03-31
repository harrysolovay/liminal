import type { ActionEvent } from "../Action/ActionEvent.js"
import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { ToolResult } from "./ToolResult.js"

export type ToolEvent<
  K extends keyof any = keyof any,
  A extends JSONObject = JSONObject,
  E extends ActionEvent = any,
  T extends ToolResult = ToolResult,
> = EnableToolEvent<K> | ToolEnterEvent<K, A> | ToolInnerEvent<K, E> | ToolExitEvent<K, T>

export interface EnableToolEvent<K extends keyof any = keyof any> extends ActionEventBase<"EnableTool"> {
  key: K
  description: string
  schema: object
}

export interface ToolEnterEvent<K extends keyof any, A extends JSONObject> extends ActionEventBase<"ToolEnter"> {
  tool: K
  args: A
}

export interface ToolInnerEvent<K extends keyof any, E extends ActionEvent> extends ActionEventBase<"ToolInner"> {
  tool: K
  inner: E
}

export interface ToolExitEvent<K extends keyof any, T extends ToolResult> extends ActionEventBase<"ToolExit"> {
  tool: K
  result: T
}
