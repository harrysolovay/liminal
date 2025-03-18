import type { Expand } from "../../util/Expand.js"
import type { ObjectFields, ObjectT } from "./intrinsics/object.js"
import type { TypeLike } from "./TypeLike.js"

export type Params = TypeLike | ObjectFields

export type ParamsO<S extends TypeLike | ObjectFields> = S extends TypeLike<infer T>
  ? T
  : S extends ObjectFields
    ? Expand<ObjectT<S, "O">>
    : never
