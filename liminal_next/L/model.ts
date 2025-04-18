import type { Adapter } from "../Provider.ts"
import type { Reference } from "../Reference.ts"
import type { PushModel } from "../runes/PushModel.ts"

export interface model extends Iterable<PushModel, Reference<Adapter>> {}

export declare function model(adapter: Adapter): model
