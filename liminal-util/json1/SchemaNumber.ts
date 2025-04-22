import type { JSONSchemaNumberCommon } from "./SchemaNumberCommon.ts"
import type { JSONSchemaTypeBase } from "./SchemaTypeBase.ts"

export interface SchemaNumber extends JSONSchemaTypeBase<"number">, JSONSchemaNumberCommon {}
