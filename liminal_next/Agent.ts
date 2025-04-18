import type { LEvent } from "./events/LEvent.ts"
import type { Runic } from "./Runic.ts"

export interface Agent<T = any, E extends LEvent = LEvent> extends PromiseLike<T>, Iterable<E, T> {}

export declare function Agent<X extends Runic>(runic: X): Agent<Runic.T<X>, Runic.E<X>>
