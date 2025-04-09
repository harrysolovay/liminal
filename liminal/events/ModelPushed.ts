import type { ModelType } from "../Model.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./EventBase.ts"

export interface ModelPushed<K extends JSONKey = JSONKey, M extends ModelType = ModelType>
  extends EventBase<"model_pushed">
{
  modelKey: K
  modelType: M
}
