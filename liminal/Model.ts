import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "./Action.ts"
import type { Agent } from "./Agent.ts"
import type { JSONObject } from "./util/JSONObject.ts"

export type Model = LanguageModel | EmbeddingModel

export interface LanguageModel extends ModelBase<"language"> {
  infer: (type: StandardSchemaV1<JSONObject, any> | undefined) => Agent<Action, any>
}

export interface EmbeddingModel extends ModelBase<"embedding"> {
  embed: (value: string) => Promise<Array<number>>
}

interface ModelBase<K extends ModelType> {
  type: K
}

export type ModelType = "language" | "embedding"
