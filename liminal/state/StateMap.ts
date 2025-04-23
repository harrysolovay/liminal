export class StateMap extends Map<StateFactory, Cloneable> {
  clone(): StateMap {
    const clone = new StateMap()
    for (const [key, value] of this.entries()) {
      clone.set(key, value.clone())
    }
    return clone
  }

  getOrInit<T extends Cloneable>(factory: StateFactory<T>): T {
    let instance = this.get(factory)
    if (!instance) {
      instance = factory()
      this.set(factory, instance)
    }
    return instance as never
  }
}

export type StateFactory<T = any> = (instance?: T) => T

export interface Cloneable {
  clone(): this
}
