import type { Model } from "../Model.ts"
import type { PushModel } from "../Rune/PushModel.ts"
import type { LBase } from "./_LBase.ts"

export interface model extends LBase<PushModel, Model> {}

export declare function model(): model
