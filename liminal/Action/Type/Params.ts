import type { Expand } from "../../util/Expand.js"
import type { ObjectFields, ObjectT } from "./intrinsics/object.js"
import type { Type } from "./Type.js"

export type Params = Type | ObjectFields

export type ParamsO<S extends Type | ObjectFields> = S extends Type<any, infer O>
  ? O
  : S extends ObjectFields
    ? Expand<ObjectT<S, "O">>
    : never
