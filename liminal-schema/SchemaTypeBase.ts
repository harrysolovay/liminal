import type { json } from "liminal-util"
import type { SchemaBase } from "./SchemaBase.ts"

export interface SchemaTypeBase<K extends json.SchemaTypeName> extends SchemaBase {
  type: K
  anyOf?: never
}
