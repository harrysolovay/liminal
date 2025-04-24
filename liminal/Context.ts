import { assert } from "liminal-util"
import { AsyncLocalStorage } from "node:async_hooks"

const storage = new AsyncLocalStorage<Context>()

export class Context extends Map<ContextHandle, unknown> {
  static ensure(): Context {
    const context = storage.getStore()
    assert(context)
    return context
  }

  get<V>(context: ContextHandle<V>): V | undefined {
    return super.get(context) as never
  }

  getOrInit<V>(context: ContextHandle<V>, init: () => V): V {
    if (this.has(context)) {
      return this.get(context) as V
    }
    const instance = init()
    this.set(context, instance)
    return instance
  }

  set<V>(context: ContextHandle<V>, value: V): this {
    super.set(context, value)
    return this
  }

  run<R>(callback: () => R): R {
    return storage.run(this, callback)
  }

  clone(overrides?: Iterable<[ContextHandle, unknown]>): Context {
    const context = new Context(overrides)
    for (const [handle, value] of this.entries()) {
      if (!context.has(handle)) {
        context.set(handle, handle.clone?.(value) ?? value)
      }
    }
    return context
  }
}

export type ContextHandle<V = any> = {
  clone?: ((value: V) => V) | undefined
}

export function ContextHandle<V>(clone?: (value: V) => V): ContextHandle<V> {
  return { clone }
}
