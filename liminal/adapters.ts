import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Action } from "./Action.ts"
import type { Actor } from "./Actor.ts"
import type { JSONObject } from "./util/JSONObject.ts"

export type RunInfer = (type: StandardSchemaV1<JSONObject> | undefined) => Actor<Action, any>

export type RunEmbed = (value: string) => Promise<Array<number>>
