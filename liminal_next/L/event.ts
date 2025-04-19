import type { Emit } from "../runes/Emit.ts"

export interface event<K extends keyof any, V> extends Iterable<Emit<K, V>, void> {}

export declare function event<K extends keyof any, V = undefined>(key: K, value?: V): event<K, V>
