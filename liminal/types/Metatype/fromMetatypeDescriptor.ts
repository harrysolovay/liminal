import type { JSONObject } from "../../util/JSONObject.ts"
import { array } from "../array.ts"
import { boolean } from "../boolean.ts"
import { enum as enum_ } from "../enum.ts"
import { integer } from "../integer.ts"
import { number } from "../number.ts"
import { type JSONObjectType, object } from "../object.ts"
import { string } from "../string.ts"
import type { Type } from "../Type.ts"
import { union } from "../union.ts"
import type { MetatypeDescriptor, MetatypeRootDescriptor } from "./MetatypeDescriptor.ts"

export function fromMetatypeRootDescriptor(descriptor: MetatypeRootDescriptor): Type<JSONObject, JSONObjectType> {
  return fromMetatypeDescriptor(descriptor) as never
}

export function fromMetatypeDescriptor(descriptor: MetatypeDescriptor): Type {
  return make(descriptor)(descriptor.value.description)
}

function make(descriptor: MetatypeDescriptor): Type {
  switch (descriptor.type) {
    case "atom": {
      switch (descriptor.value.atomType) {
        case "boolean":
          return boolean
        case "integer":
          return integer
        case "number":
          return number
        case "string":
          return string
      }
    }
    case "array": {
      return array(fromMetatypeDescriptor(descriptor.value.items))
    }
    case "enum": {
      return enum_(...descriptor.value.variants)
    }
    case "record": {
      return object(Object.fromEntries(descriptor.value.fields.map(({
        key,
        value,
        description,
      }) => [key, fromMetatypeDescriptor(value)(description)])))
    }
    case "union": {
      return union(...descriptor.value.members.map(fromMetatypeDescriptor))
    }
  }
}
