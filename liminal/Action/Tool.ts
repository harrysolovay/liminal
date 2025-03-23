import type { AgentTool } from "./AgentTool.js"
import type { UnitTool } from "./UnitTool.js"

export type Tool<K extends string = string> = UnitTool<K> | AgentTool<K>
