import type { JSONSchemaNumberCommon } from "./JSONSchemaNumberCommon.ts"
import type { JSONSchemaTypeBase } from "./JSONSchemaTypeBase.ts"

export interface JSONSchemaInteger extends JSONSchemaTypeBase<"integer">, JSONSchemaNumberCommon {}
