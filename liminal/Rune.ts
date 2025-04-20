import type { Fiber } from "./Fiber.ts"
import type { Runic } from "./Runic.ts"
import type { StateConstructor, StateMap } from "./StateMap.ts"

export type Rune = AwaitRune | EmitRune | ForkRune | JoinRune | StateRune

export interface AwaitRune {
  type: "await"
  value: any
}

export interface EmitRune<K extends keyof any = keyof any, V = any> {
  type: "emit"
  key: K
  value: V
}

export interface ForkRune {
  type: "fork"
  runic: Runic
  state: StateMap | undefined
}

export interface JoinRune {
  type: "join"
  fibers: Array<Fiber>
}

export interface StateRune {
  type: "state"
  constructors: Array<StateConstructor>
}
