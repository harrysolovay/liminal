import type { ActionEvent } from "../Action/ActionEvent.ts"
import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface ContextEvent<K extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"context">
{
  context: K
  event: E
}
