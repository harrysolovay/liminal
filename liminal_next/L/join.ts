import type { Agent } from "../Agent.ts"
import { RuneBase } from "../runes/_RuneBase.ts"
import type { Join } from "../runes/Join.ts"

export interface join<T> extends Iterable<Join, T> {}

export function join<XA extends Array<Agent>>(...fibers: XA): join<{ [I in keyof XA]: XA[I]["T"] }> {
  return {
    *[Symbol.iterator](): Generator<Join> {
      return yield RuneBase("join", { agents: fibers })
    },
  }
}
