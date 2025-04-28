import { RuneKey, type StateRune } from "./Rune.ts"

export class Context extends Map<State, unknown> {
  fork(override?: Context): Context {
    const instance = new Context(override)
    for (const [state, value] of this.entries()) {
      if (!instance.has(state)) {
        instance.set(state, state.f(value))
      }
    }
    return instance
  }

  getOrInit<V>(state: State<V>): V {
    if (this.has(state)) {
      return this.get(state) as never
    }
    const instance = state.f()
    this.set(state, instance)
    return instance
  }
}

export interface State<V = any> extends Iterable<StateRune, V> {
  f(parent?: V): V
}

export function State<V>(f: (parent?: V) => V): State<V> {
  return {
    f,
    *[Symbol.iterator](): Generator<StateRune, V> {
      return yield {
        [RuneKey]: true,
        kind: "state",
        state: this,
      } satisfies Omit<StateRune, "event"> as never
    },
  }
}
