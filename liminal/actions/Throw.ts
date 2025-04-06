import { Action, type EventBase } from "../Action.ts"
import { unimplemented } from "../util/unimplemented.ts"

function* throw_<V>(
  _value: V,
  ...[_error]: unknown extends V ? [typeof WIDENING_THROW_TYPE_ERROR]
    : [V] extends [never] ? [typeof WIDENING_THROW_TYPE_ERROR]
    : []
): Generator<
  Action<"throw", {
    Entry: never
    Event: never
    Throw: never
  }>,
  never
> {
  return (yield (Action<never>()("throw", (_scope) => {
    unimplemented()
  }))) as never
}
Object.defineProperty(throw_, "name", { value: "throw" })
export { throw_ as throw }

export interface ThrownEvent extends EventBase<"thrown"> {
  thrown: unknown
}

export declare const WIDENING_THROW_TYPE_ERROR: unique symbol
