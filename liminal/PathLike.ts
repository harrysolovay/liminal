import type { _ } from "./_.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export type Path = Array<JSONKey>
export declare namespace Path {
  export type FromPathLike<P extends PathLike> = P extends [infer E0 extends KeyLike, ...infer ERest extends PathLike]
    ? [E0 extends JSONKey ? E0 : JSONKey, ...FromPathLike<ERest>]
    : []
}

export type KeyLike = JSONKey | _
export type PathLike = Array<KeyLike>
export declare namespace PathLike {
  export type FromPath<P extends Path> = P extends [infer E0, ...infer ERest extends Path]
    ? [E0 | _, ...FromPath<ERest>]
    : []
}
