import type { Tool } from "./Tool.js"

export function* DisableTool<K extends string>(tool: Tool): Generator<DisableTool, void> {
  return yield {
    kind: "DisableTool",
    tool,
  }
}

export interface DisableTool {
  kind: "DisableTool"
  tool: Tool
}

export interface DisableToolEvent<K extends string = string> {
  type: "DisableTool"
  key: K
}
