import type { ActionEvent } from "../Action/ActionEvent.js"
import type { EventBase } from "../Action/ActionEventBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { ToolResult } from "./ToolResult.js"

export type ToolEvent<
  K extends string = string,
  A extends JSONObject = JSONObject,
  E extends ActionEvent = any,
  T extends ToolResult = ToolResult,
> = EnableToolEvent<K> | ToolEnterEvent<K, A> | ToolInnerEvent<K, E> | ToolExitEvent<K, T>

export interface EnableToolEvent<K extends string = string> extends EventBase<"EnableTool"> {
  key: K
  description: string
  schema: object
}

export interface ToolEnterEvent<K extends string, A extends JSONObject> extends EventBase<"ToolEnter"> {
  tool: K
  args: A
}

export interface ToolInnerEvent<K extends string, E extends ActionEvent> extends EventBase<"ToolInner"> {
  tool: K
  inner: E
}

export interface ToolExitEvent<K extends string, T extends ToolResult> extends EventBase<"ToolExit"> {
  tool: K
  result: T
}
