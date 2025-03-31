import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { JSONValue } from "../JSON/JSONValue.js"

export interface EmissionEvent<K extends keyof any = keyof any, E extends JSONValue = JSONValue>
  extends ActionEventBase<"Emission">
{
  key: K
  value: E
}
