import type { Expand } from "../util/Expand.ts"
import type { StructFields, StructT } from "./L/intrinsics/struct.ts"
import type { L } from "./L/L.ts"

export function agent<E>(template: TemplateStringsArray, ...values: Array<string | number>) {
  return null! as AgentFactory<E>
}

export interface AgentFactory<E> {
  <Y, T>(f: (this: E) => Generator<Y, T, void> | AsyncGenerator<Y, T, void>): Agent<E, never, Y, T>
  <
    Y,
    T,
    S extends L | StructFields,
    A = Expand<S extends L<any, infer O> ? O : S extends StructFields ? StructT<S, "O"> : never>,
  >(
    f: (this: E, args: A) => Generator<Y, T, void> | AsyncGenerator<Y, T, void>,
    params: S,
  ): Agent<E, A, Y, T>
}

export type Agent<E = any, A = any, Y = any, T = any> = (
  ...env: [E] extends [never] ? [] : [env: E]
) => Generator<RegisterTool, () => void>

export interface RegisterTool {
  kind: "Agent"
  agent: Agent
}
