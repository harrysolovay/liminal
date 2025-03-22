import type { AgentTool } from "./AgentTool.js"
import type { Tool } from "./Tool.js"

export interface DisableTool<K extends keyof any = keyof any> {
  kind: "DisableTool"
  tool: Tool<K>
}
