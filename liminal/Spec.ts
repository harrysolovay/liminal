import type { LEvent } from "./events/LEvent.ts"
import type { Expand } from "./util/Expand.ts"
import type { JSONEntry } from "./util/JSONEntry.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export interface Spec<
  Key extends JSONKey = JSONKey,
  Event extends LEvent = LEvent,
  Spec_ extends Spec = any,
  Entry_ extends JSONEntry = JSONEntry,
  Throw = any,
  Value = any,
> {
  Event: Event
  Child: [Key, Spec_]
  Entry: Entry_
  Throw: Throw
  Value: Value
}

export type MakeSpec<P extends Partial<Spec>> = Expand<{
  Event: [unknown] extends [P["Event"]] ? never : P["Event"]
  Child: [unknown] extends [P["Child"]] ? never : P["Child"]
  Throw: [unknown] extends [P["Throw"]] ? never : P["Throw"]
  Entry: [unknown] extends [P["Entry"]] ? never : P["Entry"]
  Value: [unknown] extends [P["Value"]] ? never : P["Value"]
}>
