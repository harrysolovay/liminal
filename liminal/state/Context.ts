import { AsyncLocalStorage } from "node:async_hooks"
import { StateMap } from "./StateMap"

class Context extends AsyncLocalStorage<StateMap> {
  get(): StateMap {
    let state = this.getStore()
    if (!state) {
      state = new StateMap()
      this.enterWith(state)
    }
    return state
  }

  fork<T>(f: () => Promise<T>): Promise<T> {
    return this.run(this.get(), f)
  }
}

export const context = new Context()
