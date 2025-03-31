import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { ModelPurpose } from "./ModelPurpose.js"

export interface ModelEvent<K extends keyof any = keyof any, P extends ModelPurpose = ModelPurpose>
  extends ActionEventBase<"Model">
{
  key: K
  purpose: P
}
