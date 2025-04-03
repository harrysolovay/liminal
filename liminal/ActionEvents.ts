import type { ActionEvent } from "./ActionEvent.ts"

export type EventHandler = (event: ActionEvent) => any

export class ActionEvents extends Array<ActionEvent> {
  constructor(
    readonly f: (event: ActionEvent) => ActionEvent,
    readonly handler: EventHandler | undefined,
  ) {
    super()
  }

  child = (f: (event: ActionEvent) => ActionEvent): ActionEvents => {
    return new ActionEvents((event) => this.f(f(event)), this.handler)
  }

  emit = (event: ActionEvent) => {
    this.push(event)
    this.handler?.(this.f(event))
  }
}
