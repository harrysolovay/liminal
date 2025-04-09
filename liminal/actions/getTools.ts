import { Action } from "../Action.ts"
import type { Tool } from "../Tool.ts"

export interface getTools extends Action<"get_tools", never> {}

export function* getTools(): Generator<getTools, Set<Tool>> {
  return yield Action("get_tools", (scope) => ({
    ...scope,
    nextArg: scope.tools,
  }))
}
