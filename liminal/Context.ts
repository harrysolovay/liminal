import { assert } from "liminal-util"
import { AsyncLocalStorage } from "node:async_hooks"

export class Context extends Map<StateFactory, unknown> {
  static storage: AsyncLocalStorage<Context> = new AsyncLocalStorage<Context>()

  static make(context?: Context): Context {
    const instance = new Context()
    if (context) {
      for (const [key, value] of context.entries()) {
        instance.set(key, key(value))
      }
    }
    return instance
  }

  static unwrap(): Context {
    const context = this.storage.getStore()
    assert(context)
    return context
  }

  static get<T>(factory: StateFactory<T>): T | undefined {
    return this.unwrap().get(factory) as never
  }

  static getAssert<T>(factory: StateFactory<T>): T {
    const value = this.get(factory)
    assert(value)
    return value
  }

  static getOrInit<T>(factory: StateFactory<T>): T {
    let context = this.unwrap()
    let instance = context.get(factory)
    if (!instance) {
      instance = factory()
      context.set(factory, instance)
    }
    return instance as never
  }
}

export type StateFactory<T = any> = (instance?: T) => T
