import type { EventHandler } from "./EventHandler.ts"
import type { LEvent } from "./LEvent.ts"

export class Events extends Array<LEvent> {
  constructor(
    readonly f: (event: LEvent) => LEvent,
    readonly handler: EventHandler | undefined,
  ) {
    super()
  }

  child = (f: (event: LEvent) => LEvent): Events => {
    return new Events((event) => this.f(f(event)), this.handler)
  }

  emit = (event: LEvent) => {
    this.push(event)
    this.handler?.(this.f(event))
  }
}
