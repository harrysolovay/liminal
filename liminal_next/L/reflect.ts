import type { Agent } from "../Agent.ts"
import { RuneBase } from "../runes/_RuneBase.ts"
import type { Reflect } from "../runes/Reflect.ts"

export interface reflect extends Iterable<Reflect, Agent> {}

export const reflect: reflect = {
  *[Symbol.iterator]() {
    return yield RuneBase("reflect", {})
  },
}
