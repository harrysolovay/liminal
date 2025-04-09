import type { _ } from "./_.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export type Path = Array<JSONKey>
export declare namespace Path {
  export type FromPathLike<P extends PathLike> = Extract<
    {
      [K in keyof P]: P[K] extends _ ? JSONKey : P[K]
    },
    Path
  >
}

export type PathLike = Array<JSONKey | _>
export declare namespace PathLike {
  export type FromPath<P extends Path> = {
    [K in keyof P]: P[K] | _
  }
}
