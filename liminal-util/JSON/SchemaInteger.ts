import type { JSONSchemaNumberCommon } from "./SchemaNumberCommon.ts"
import type { JSONSchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaInteger extends JSONSchemaTypeBase<"integer">, JSONSchemaNumberCommon {}
