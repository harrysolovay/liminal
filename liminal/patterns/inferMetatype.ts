import type { Action } from "../Action.ts"
import type { InferenceRequestedEvent, InferredEvent } from "../actions/Infer.ts"
import { fromMetatypeRootDescriptor } from "../types/Metatype/fromMetatypeDescriptor.ts"
import { MetatypeRootDescriptor } from "../types/Metatype/MetatypeDescriptor.ts"
import type { JSONObjectType } from "../types/object.ts"
import type { Type } from "../types/Type.ts"
import type { Falsy } from "../util/Falsy.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import type { TaggableArgs } from "../util/Taggable.ts"

export function* inferMetatype(...args: TaggableArgs<[...description: Array<string | Falsy>]>): Generator<
  Action<"infer", {
    Entry: never
    Event: InferenceRequestedEvent | InferredEvent<MetatypeRootDescriptor>
    Throw: never
  }>,
  Type<JSONObject, JSONObjectType<any>>
> {
  const descriptor = yield* MetatypeRootDescriptor(args.map((e) => typeof e === "string").join("\n"))
  return fromMetatypeRootDescriptor(descriptor)
}
