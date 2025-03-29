import type { State } from "../State.js"
import { ActionBase } from "./ActionBase.js"

export interface CurrentState extends ActionBase<"CurrentState", never> {}

export function* CurrentState(): Generator<CurrentState, State> {
  return yield ActionBase("CurrentState", {})
}
