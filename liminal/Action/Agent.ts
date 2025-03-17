import type { Expand } from "../util/Expand.js"
import type { StructFields, StructT } from "./L/intrinsics/struct.js"
import type { L } from "./L/L.js"

export function tool<E = never>(template: TemplateStringsArray, ...values: Array<string | number>) {
  return null! as ImplementTool<E>
}

export interface ImplementTool<E> {
  <Y, T>(
    f: (...rest: [E] extends [never] ? [] : [this: E]) => Generator<Y, T, void> | AsyncGenerator<Y, T, void>,
  ): ToolFactory<E>
  <
    Y,
    T,
    S extends L | StructFields,
    A = S extends L<any, infer O> ? O : Expand<S extends StructFields ? StructT<S, "O"> : never>,
  >(
    f: (
      ...rest: [...([E] extends [never] ? [] : [this: E]), args: A]
    ) => Generator<Y, T, void> | AsyncGenerator<Y, T, void>,
    params: S,
  ): ToolFactory<E>
}

export type ToolFactory<E = any> = (...env: [E] extends [never] ? [] : [env: E]) => Generator<Tool, () => void, void>

export interface Tool {
  kind: "Tool"
  tool: ToolFactory
}
