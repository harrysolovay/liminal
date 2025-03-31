import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { ModelPurpose } from "./ModelPurpose.js"

export interface ModelDeclaredEvent<K extends keyof any = keyof any, P extends ModelPurpose = ModelPurpose>
  extends ActionEventBase<"model_declared">
{
  key: K
  purpose: P
}
