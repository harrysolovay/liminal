import type { Fiber } from "./Fiber.ts"
import type { Runic } from "./Runic.ts"
import type { StateConstructor, StateMap } from "./StateMap.ts"

export type Rune = AwaitRune | LEventRune | ForkRune | JoinRune | StateRune

export interface AwaitRune {
  type: "await"
  value: any
}

export interface LEventRune<K extends keyof any = keyof any, V = any> {
  type: "event"
  key: K
  value: V
}

export interface ForkRune<Y extends Rune = Rune, T = any> {
  type: "fork"
  runic: Runic<Y, T>
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
