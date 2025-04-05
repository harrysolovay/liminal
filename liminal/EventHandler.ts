import type { EnteredEvent, ExitedEvent } from "./actions/actions_common.ts"
import type { LEvent } from "./LEvent.ts"

export type EventHandler<
  E extends LEvent = LEvent,
  T = any,
> = (event: EnteredEvent | E | ExitedEvent<T>) => any
