import type { LEvent } from "./events/LEvent.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export interface Spec {
  Entry: [JSONKey, any]
  Event: LEvent
  Throw: any
}

export type MergeSpec<S extends Spec> = {
  Entry: S["Entry"]
  Event: S["Event"]
  Throw: S["Throw"]
}
