import type { Expand, U2I } from "../../util/mod.ts"
import * as I from "../intrinsics.ts"
import type { AnyType, Type } from "../Type.ts"

export function Intersection<S extends Array<AnyType>>(
  ...sources: Ensure<S>
): Type<Expand<U2I<S[number]["T"]>>, S[number]["D"]> {
  return I.object(
    Object.fromEntries(
      sources.flatMap((source) => Object.entries(source.args?.[0]!)),
    ) as never,
  )
}

type Ensure<S extends Array<AnyType>> = [ConflictingKey<S>] extends [never] ? S
  : never

type ConflictingKey<S extends Array<AnyType>, V extends string = never> = S extends [
  infer E0 extends AnyType,
  ...infer ERest extends Array<AnyType>,
] ?
    | keyof { [K in keyof E0["T"] as K extends V ? K : never]: true }
    | ConflictingKey<ERest, V | Extract<keyof E0["T"], string>>
  : never
