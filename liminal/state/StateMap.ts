export class StateMap extends Map<StateConstructor<Cloneable>, Cloneable> {
  clone(): StateMap {
    const clone = new StateMap()
    for (const [key, value] of this.entries()) {
      clone.set(key, value.clone())
    }
    return clone
  }
}

export type StateConstructor<T extends Cloneable = Cloneable> = new() => T

export interface Cloneable {
  clone(): this
}
