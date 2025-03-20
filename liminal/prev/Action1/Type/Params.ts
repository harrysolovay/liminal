import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Expand } from "../../../util2/Expand.js"
import type { ObjectFields, ObjectT } from "./intrinsics/object.js"

export type Params = StandardSchemaV1 | ObjectFields

export type ParamsO<S extends Params> = S extends StandardSchemaV1<any, infer T>
  ? T
  : S extends ObjectFields
    ? Expand<ObjectT<S, "O">>
    : never
