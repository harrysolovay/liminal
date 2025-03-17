import type { Expand } from "../util/Expand.js"
import type { StructFields, StructT } from "./L/intrinsics/struct.js"
import type { L } from "./L/L.js"

export function agent<E = never>(template: TemplateStringsArray, ...values: Array<string | number>) {
  return null! as AgentFactory<E>
}

export interface AgentFactory<E> {
  <Y, T>(
    f: (...rest: [E] extends [never] ? [] : [this: E]) => Generator<Y, T, void> | AsyncGenerator<Y, T, void>,
  ): Agent<E, never, Y, T>
  <
    Y,
    T,
    S extends L | StructFields,
    A = Expand<S extends L<any, infer O> ? O : S extends StructFields ? StructT<S, "O"> : never>,
  >(
    f: (
      ...rest: [...([E] extends [never] ? [] : [this: E]), args: A]
    ) => Generator<Y, T, void> | AsyncGenerator<Y, T, void>,
    params: S,
  ): Agent<E, A, Y, T>
}

export type Agent<E = any, A = any, Y = any, T = any> = (
  ...env: [E] extends [never] ? [] : [env: E]
) => AgentInstance<T>

export interface AgentInstance<T> extends Generator<Dispatch, T, void> {
  asTool: () => Generator<RegisterTool, () => void, void>
}

export interface Dispatch {
  kind: "Dispatch"
  agent: Agent
}

export interface RegisterTool {
  kind: "RegisterTool"
  agent: Agent
}
