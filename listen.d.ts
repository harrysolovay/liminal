import * as Effect from "effect/Effect";
import type { RuntimeFiber } from "effect/Fiber";
import * as Scope from "effect/Scope";
import type { LEvent } from "./liminal/LEvent.ts";
import type { Thread } from "./liminal/Thread.ts";
/** Attach an event handler to process thread events. */
export declare const listen: <A, E, R>(f: (event: LEvent) => Effect.Effect<A, E, R>) => Effect.Effect<RuntimeFiber<void, E>, never, Thread | R | Scope.Scope>;
