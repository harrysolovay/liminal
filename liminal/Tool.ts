import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "./Action.ts"
import type { Agent } from "./Agent.ts"
import type { Scope } from "./Scope.ts"
import { assert } from "./util/assert.ts"
import { isJSONValue } from "./util/isJSONValue.ts"
import type { JSONKey } from "./util/JSONKey.ts"
import type { JSONObject } from "./util/JSONObject.ts"
import type { JSONValue } from "./util/JSONValue.ts"
import type { PromiseOr } from "./util/PromiseOr.ts"

export interface ToolConfig<K extends JSONKey = JSONKey> {
  toolKey: K
  description: string
  params: StandardSchemaV1<JSONObject, any>
  implementation: ToolImplementation
}

export interface Tool<K extends JSONKey = JSONKey> extends ToolConfig<K> {
  executor: (scope: Scope) => ToolExecutor
}

export function Tool<K extends JSONKey>(config: ToolConfig<K>): Tool<K> {
  return {
    ...config,
    executor,
  }
}

export type ToolImplementation = (params: any) => Agent<Action, ToolResult> | PromiseOr<ToolResult>

export type ToolExecutor = (args: any) => Promise<JSONValue>

export type ToolResult = JSONValue | void

function executor(this: Tool, scope: Scope): ToolExecutor {
  return async (args) => {
    scope.event({
      type: "tool_called",
      args,
      tool: this.toolKey,
    })
    const parsed = await this.params["~standard"].validate(args)
    assert(!parsed.issues)
    const { value: transformed } = parsed
    const initial = await this.implementation(transformed)
    if (isJSONValue(initial)) {
      return { value: initial }
    }
    const fork = scope.fork("tool", [this.toolKey])
    const { value } = await fork.reduce(initial as Agent)
    fork.event({
      type: "returned",
      value,
    })
    return { value }
  }
}
