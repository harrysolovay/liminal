import { PgDrizzle } from "@effect/sql-drizzle/Pg";
import * as Effect from "effect/Effect";
export declare const relay: Effect.Effect<import("effect/Fiber").RuntimeFiber<void, never>, never, import("./liminal/Thread.ts").Thread | PgDrizzle | import("effect/Scope").Scope>;
