import type { LEvent } from "./events/LEvent.ts"

export interface Spec {
  Entry: [keyof any, any]
  Event: LEvent
  Throw: any
}

export type MergeSpec<S extends Spec> = {
  Entry: S["Entry"]
  Event: S["Event"]
  Throw: S["Throw"]
}
