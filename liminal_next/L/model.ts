import type { Adapter } from "../Adapter.ts"
import type { Reference } from "../Reference.ts"
import type { PushModel } from "../runes/PushModel.ts"
import type { LBase } from "./_LBase.ts"

export interface model extends LBase<PushModel, Reference<Adapter>> {}

export declare function model(adapter: Adapter): model
