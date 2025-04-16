import type { Reply } from "../Rune/Reply.ts"
import type { Schema } from "../Schema.ts"
import type { LBase } from "./_LBase.ts"

export interface reply<T> extends LBase<Reply<T>, T> {}

export declare function reply<T = string>(schema: Schema<T>): reply<T>
