import type { ActionEvent } from "./ActionEvent.ts"

export type EventHandler = (event: ActionEvent) => any

export class ActionEvents extends Array<ActionEvent> {
  constructor(
    readonly f: (inner: ActionEvent) => ActionEvent,
    readonly handler: EventHandler | undefined,
  ) {
    super()
  }

  child = (f: (inner: ActionEvent) => ActionEvent): ActionEvents => {
    return new ActionEvents((inner) => this.f(f(inner)), this.handler)
  }

  emit = (event: ActionEvent) => {
    this.push(event)
    this.handler?.(this.f(event))
  }
}
