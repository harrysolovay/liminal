import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface EmbeddingModelSetEvent<K extends keyof any = keyof any>
  extends ActionEventBase<"embedding_model_set">
{
  key: K
}
