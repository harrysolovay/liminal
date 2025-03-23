import type { Tool } from "./Tool.js"

export interface DisableTool<K extends string = string> {
  kind: "DisableTool"
  tool: Tool<K>
}
