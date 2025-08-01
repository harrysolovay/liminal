import type { Effect } from "effect/Effect"
import type { Pipeable } from "effect/Pipeable"
import type { Covariant } from "effect/Types"
import * as YieldUnwrap from "./YieldUnwrap.ts"

export const ReducerTypeId: unique symbol = Symbol.for("liminal/Reducer")
export type ReducerTypeId = typeof ReducerTypeId

export interface Reducer<E, R> extends Reducer.Variance<E, R>, Pipeable {
  reduce: () => Generator<YieldUnwrap.Any, Effect<void>>
}

export declare namespace Reducer {
  export interface Variance<out E, out R> {
    readonly [ReducerTypeId]: VarianceStruct<E, R>
  }

  export interface VarianceStruct<out E, out R> {
    readonly _E: Covariant<E>
    readonly _R: Covariant<R>
  }
}

export type Reduce<Y, E1, R1> = () => Generator<Y, Effect<void, E1, R1>, never>
