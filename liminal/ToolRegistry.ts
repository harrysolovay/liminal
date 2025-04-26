import { ContextPart } from "liminal"
import type { Tool } from "./Tool"

export class ToolRegistry extends Set<Tool> {
  clone(): ToolRegistry {
    return new ToolRegistry([...this])
  }
}

export const ToolRegistryContext: ContextPart<ToolRegistry> = ContextPart(() => new ToolRegistry(), "tool_registry")
