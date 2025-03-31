import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { JSONValue } from "../JSON/JSONValue.ts"

export interface EmittedEvent<K extends keyof any = keyof any, E extends JSONValue = JSONValue>
  extends ActionEventBase<"emitted">
{
  key: K
  value: E
}
