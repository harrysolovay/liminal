import type { LEvent } from "./LEvent.ts"

export interface Spec {
  Entry: [keyof any, any]
  Event: LEvent
}

export type MergeSpec<S extends Spec> = {
  Entry: S["Entry"]
  Event: S["Event"]
}
