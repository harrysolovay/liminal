import type { JSON } from "liminal-util"
import type { SchemaBase } from "./SchemaBase.ts"

export interface SchemaTypeBase<K extends JSON.SchemaTypeName> extends SchemaBase {
  type: K
}
