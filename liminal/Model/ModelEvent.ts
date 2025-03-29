import type { EventBase } from "../Action/ActionEventBase.js"
import type { ModelPurpose } from "./ModelPurpose.js"

export interface ModelEvent<K extends string = string, P extends ModelPurpose = ModelPurpose>
  extends EventBase<"Model">
{
  key: K
  purpose: P
}
