import type { Infer, InferenceRequestedEvent, InferredEvent } from "../actions/Infer.ts"
import { fromMetatypeRootDescriptor } from "../types/Metatype/fromMetatypeDescriptor.ts"
import { MetatypeRootDescriptor } from "../types/Metatype/MetatypeDescriptor.ts"
import type { JSONObjectType } from "../types/object.ts"
import type { Type } from "../types/Type.ts"
import type { JSONObject } from "../util/JSONObject.ts"

export const metatype: Iterable<
  Infer<{
    Entry: never
    Event: InferenceRequestedEvent | InferredEvent<MetatypeRootDescriptor>
  }>,
  Type<JSONObject, JSONObjectType<any>>
> = {
  *[Symbol.iterator]() {
    return fromMetatypeRootDescriptor(yield* MetatypeRootDescriptor)
  },
}
