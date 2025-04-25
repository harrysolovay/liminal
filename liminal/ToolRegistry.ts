import { ContextHandle } from "liminal"
import type { Tool } from "./Tool"

export class ToolRegistry extends Set<Tool> {}
export const ToolRegistryContext: ContextHandle<ToolRegistry> = ContextHandle()
