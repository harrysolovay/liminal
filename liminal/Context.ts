import { AsyncLocalStorage } from "node:async_hooks"

const storage = new AsyncLocalStorage<Context>()

export class Context extends Map<ContextPart, unknown> {
  static get(): Context | undefined {
    return storage.getStore()
  }

  run<R>(f: () => R): R {
    return storage.run(this, f)
  }

  fork(): Context {
    const context = new Context()
    for (const [handle, value] of this.entries()) {
      if (!context.has(handle)) {
        context.set(handle, handle.fork(value))
      }
    }
    return context
  }
}

export interface ContextPart<V = any> {
  fork(parent?: V): V
  get(): V | undefined
  debug?: string
}

export function ContextPart<V>(fork: (parent?: V) => V, debug?: string): ContextPart<V> {
  const self: ContextPart<V> = {
    fork,
    get() {
      return Context.get()?.get(self) as never
    },
    ...debug && { debug },
  }
  return self
}
