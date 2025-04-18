import type { Emit } from "../runes/Emit.ts"

export interface emit<K extends keyof any, V> extends Iterable<Emit<K, V>, void> {}

export declare function emit<K extends keyof any, V = undefined>(key: K, value?: V): emit<K, V>
