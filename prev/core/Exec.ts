import { Visitor } from "./_Visitor.ts"
import type { Action } from "./Action.ts"
import type { Message } from "./Message.ts"
import { Thread } from "./Thread.ts"

export interface Exec<T, E> extends AsyncIterable<E, T, void> {
  value(): Promise<T>
}

export function Exec<Y extends Action, T>(
  iter: Iterator<Y, T>,
): Exec<T, Action.ExtractEvent<Y>> {
  throw 0
}

interface ExecState {
  system: Record<string, string>
  messages: Array<Message>
}

const visit = Visitor<typeof Thread, ExecState, Iterator<unknown, unknown>>(Thread, {
  new(state, _1, key, iterator) {
    return iterator
  },
  branch(state, _1, key, iterator) {
    return iterator
  },
  join(state, _1, ...threads) {
    return (function*() {})()
  },
})
