import type { ActionEvent } from "./ActionEvent.ts"

export interface Spec {
  Entry: [keyof any, any]
  Event: ActionEvent
}

export type MergeSpec<S extends Spec> = {
  Entry: S["Entry"]
  Event: S["Event"]
}
