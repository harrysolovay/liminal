import type { ResolvedEvent } from "./ResolvedEvent.ts"

export type EventHandler<E extends ResolvedEvent = ResolvedEvent> = (event: E) => any
