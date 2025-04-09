import type { _ } from "./_.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export type PathLike = Array<JSONKey | _>

export declare namespace PathLike {
  export type Make<P extends Array<JSONKey>> = {
    [K in keyof P]: P[K] | _
  }

  export type ToPath<P extends PathLike> = Extract<
    {
      [K in keyof P]: P[K] extends _ ? JSONKey : P[K]
    },
    Array<JSONKey>
  >
}
