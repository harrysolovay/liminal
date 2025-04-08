import type { EventScope } from "./EventScope.ts"

export type EventHandler<E extends EventScope = EventScope> = (event: E) => any
