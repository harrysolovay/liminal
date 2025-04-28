import { ContextPart } from "./Context.ts"
import type { Tool } from "./Tool.ts"

export class ToolRegistry extends Set<Tool> {
  clone(): ToolRegistry {
    return new ToolRegistry([...this])
  }
}

export const ToolRegistryContext: ContextPart<ToolRegistry> = ContextPart(() => new ToolRegistry(), "tool_registry")
