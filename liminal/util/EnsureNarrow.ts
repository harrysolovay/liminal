export type EnsureNarrow<V> = unknown extends V ? [error: typeof WIDENING_TYPE_DISALLOWED]
  : [V] extends [never] ? [error: typeof WIDENING_TYPE_DISALLOWED]
  : []

export declare const WIDENING_TYPE_DISALLOWED: unique symbol
