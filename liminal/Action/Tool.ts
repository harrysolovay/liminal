import type { AgentTool } from "./AgentTool.js"
import type { UnitTool } from "./UnitTool.js"

export type Tool<K extends keyof any = keyof any> = UnitTool<K> | AgentTool<K>
