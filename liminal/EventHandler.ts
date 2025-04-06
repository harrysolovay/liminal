import type { LEvent } from "./events/LEvent.ts"
import type { ReturnedEvent } from "./events/ReturnedEvent.ts"

export type EventHandler<E extends LEvent = LEvent, T = any> = (event: E | ReturnedEvent<T>) => any
