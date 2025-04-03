import type { JSONIdentifiedType, JSONType } from "./JSONType.ts"

export const JSONSchema$schema = "http://json-schema.org/draft-07/schema#"

export type JSONRootType<J extends JSONType> = J & {
  $schema: typeof JSONSchema$schema
  $defs: Record<string, JSONIdentifiedType | undefined>
}
