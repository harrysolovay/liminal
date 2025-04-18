import type { LEvent } from "../events/LEvent.ts"
import type { Propagated } from "../events/Propagated.ts"
import type { Branch } from "../runes/Branch.ts"
import type { Runic, RunicCollection } from "../Runic.ts"
import type { LBase } from "./_LBase.ts"

export interface branch<T, E extends LEvent> extends LBase<Branch<E>, T> {}

/** Create child agents with isolated copies of the current agent's models and messages. */
export declare function branch<X extends Runic>(runic: X): branch<Runic.T<X>, Runic.E<X>>
export declare function branch<const XA extends Array<Runic>>(runics: XA): branch<
  RunicCollection.T<XA>,
  {
    [I in keyof XA]: XA[I] extends Runic ? Propagated<I, Runic.E<XA[I]>> : never
  }[number]
>
export declare function branch<const XR extends Record<string, Runic>>(runics: XR): branch<
  RunicCollection.T<XR>,
  {
    [K in keyof XR]: XR[K] extends Runic ? Propagated<K, Runic.E<XR[K]>> : never
  }[keyof XR]
>
