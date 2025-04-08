import type { LEvent } from "./events/LEvent.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export type Entry = [JSONKey, any]

export interface Spec<
  Key extends JSONKey = JSONKey,
  Event extends LEvent = LEvent,
  Spec_ extends Spec = any,
  Entry_ extends Entry = Entry,
  Throw = any,
> {
  Event: Event
  Child: [Key, Spec_]
  Entry: Entry_
  Throw: Throw
  // Value: Value
}

export type MakeSpec<P extends Partial<Spec>> = {
  Event: [unknown] extends [P["Event"]] ? never : P["Event"]
  Child: [unknown] extends [P["Child"]] ? never : P["Child"]
  Entry: [unknown] extends [P["Entry"]] ? never : P["Entry"]
  Throw: [unknown] extends [P["Throw"]] ? never : P["Throw"]
}
