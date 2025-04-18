import type { Emit } from "../runes/Emit.ts"
import type { LBase } from "./_LBase.ts"

export interface emit<K extends keyof any, V> extends LBase<Emit<K, V>, void> {}

export declare function emit<K extends keyof any, V = undefined>(key: K, value?: V): emit<K, V>
