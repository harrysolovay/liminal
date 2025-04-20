import type { Fiber } from "./Fiber.ts"

export type Rune = (fiber: Fiber) => any

// export interface AwaitRune {
//   type: "await"
//   value: any
// }

// export interface EventRune<K extends keyof any = keyof any, V = any> {
//   type: "event"
//   key: K
//   value: V
// }

// export interface ForkRune<Y extends Rune = Rune, T = any> {
//   type: "fork"
//   runic: Runic<Y, T>
//   state: StateMap | undefined
// }

// export interface JoinRune {
//   type: "join"
//   fibers: Array<Fiber>
// }

// export interface ReflectRune {
//   type: "reflect"
// }

// export interface StateRune {
//   type: "state"
//   constructors: Array<StateConstructor>
// }
