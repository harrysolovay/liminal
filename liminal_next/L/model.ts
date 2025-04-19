import type { Model } from "../Model.ts"
import type { PushModel } from "../runes/PushModel.ts"

export interface model extends Iterable<PushModel, void> {}

export declare function model(adapter: Model): model
