import type { Arg, Param } from "../annotations/mod.ts"
import type { AnyType } from "../Type.ts"

export function extract<K extends symbol, V>(this: AnyType, param: Param<K, V>): Array<V> {
  return this.annotations.filter((annotation): annotation is Arg<K> =>
    typeof annotation === "object" && annotation?.node === "Arg"
    && annotation.key === param.key
  ).map((arg) => arg.value)
}
