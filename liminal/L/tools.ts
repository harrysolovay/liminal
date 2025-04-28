import { State } from "../Context.ts"
import { ToolRegistry } from "../ToolRegistry.ts"

export const tools: State<ToolRegistry> = State(() => new ToolRegistry())
