import type { Fiber } from "./Fiber.ts"
import type { Runic } from "./Runic.ts"
import type { StateConstructor, StateMap } from "./StateMap.ts"

export type Rune = Await | Fork | Join | States

export interface Await {
  type: "await"
  value: any
}

export interface Fork {
  type: "fork"
  runic: Runic
  state: StateMap | undefined
}

export interface Join {
  type: "join"
  fibers: Array<Fiber>
}

export interface States {
  type: "states"
  constructors: Array<StateConstructor>
}
