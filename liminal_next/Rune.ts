import type { Fiber } from "./Fiber.ts"
import type { Runic } from "./Runic.ts"

export type Rune = Await | Launch | Join | State

export interface Await {
  type: "await"
  value: any
}

export interface Launch {
  type: "launch"
  runic: Runic
}

export interface Join {
  type: "join"
  fibers: Array<Fiber>
}

export interface State<T = any> {
  type: "state"
  constructor: new() => T
  value: T | undefined
}
