import type { EventResolved } from "./EventResolved.ts"

export type EventHandler<E extends EventResolved = EventResolved> = (event: E) => any
