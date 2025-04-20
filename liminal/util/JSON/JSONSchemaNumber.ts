import type { JSONSchemaNumberCommon } from "./JSONSchemaNumberCommon.ts"
import type { JSONSchemaTypeBase } from "./JSONSchemaTypeBase.ts"

export interface JSONSchemaNumber extends JSONSchemaTypeBase<"number">, JSONSchemaNumberCommon {}
