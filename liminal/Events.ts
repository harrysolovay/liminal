import type { ActionEvent } from "./Action/ActionEvent.ts"

export type EventHandler = (event: ActionEvent) => any

export class Events extends Array<ActionEvent> {
  constructor(
    readonly f: (inner: ActionEvent) => ActionEvent,
    readonly handler: EventHandler | undefined,
  ) {
    super()
  }

  child = (f: (inner: ActionEvent) => ActionEvent): Events => {
    return new Events((inner) => this.f(f(inner)), this.handler)
  }

  emit = (event: ActionEvent) => {
    this.push(event)
    this.handler?.(this.f(event))
  }
}
