import type { EventResolved } from "./EventScope.ts"

export type EventHandler<E extends EventResolved = EventResolved> = (event: E) => any
