import type { ModelType } from "../Model.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./EventBase.ts"

export interface ModelRemoved<K extends JSONKey = JSONKey, M extends ModelType = ModelType>
  extends EventBase<"model_removed">
{
  modelKey: K
  modelType: M
}
