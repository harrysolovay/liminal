import { array } from "../array.ts"
import { taggedUnion } from "../derived/taggedUnion.ts"
import { enum as enum_ } from "../enum.ts"
import { object } from "../object.ts"
import { ref } from "../ref.ts"
import { string } from "../string.ts"
import type { Type } from "../Type.ts"
import type { JSONUnionType } from "../union.ts"

export type MetatypeRootDescriptor = {
  type: "record"
  value: {
    description: string
    fields: Array<{
      description: string
      key: string
      value: MetatypeDescriptor
    }>
  }
}

const recordFields = {
  description: string,
  fields: array({
    description: string,
    key: string,
    value: ref(() => MetatypeDescriptor),
  }),
}

export const MetatypeRootDescriptor: Type<MetatypeRootDescriptor> = object({
  type: "record",
  value: recordFields,
})

export type MetatypeDescriptor = MetatypeRootDescriptor | {
  type: "atom"
  value: {
    description: string
    atomType: "boolean" | "integer" | "number" | "string"
  }
} | {
  type: "enum"
  value: {
    description: string
    variants: Array<string>
  }
} | {
  type: "array"
  value: {
    description: string
    items: MetatypeDescriptor
  }
} | {
  type: "union"
  value: {
    description: string
    members: Array<MetatypeDescriptor>
  }
}

export const MetatypeDescriptor: Type<MetatypeDescriptor, JSONUnionType> = taggedUnion({
  atom: {
    description: string,
    atomType: enum_("boolean", "integer", "number", "string"),
  },
  enum: {
    description: string,
    variants: array(string),
  },
  array: {
    description: string,
    items: ref(() => MetatypeDescriptor),
  },
  record: recordFields,
  union: {
    description: string,
    members: array(ref(() => MetatypeDescriptor)),
  },
})
