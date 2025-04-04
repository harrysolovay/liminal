import type { Infer, InferenceRequestedEvent, InferredEvent } from "../actions/Infer.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import type { JSONObjectType } from "./_object.ts"
import { type Type } from "./Type.ts"

// TODO: rename?
export interface RootType<T extends JSONObject = JSONObject, J extends JSONObjectType = JSONObjectType>
  extends
    Type<T, J>,
    Iterable<
      Infer<{
        Entry: never
        Event: InferenceRequestedEvent | InferredEvent<T>
      }>,
      T
    >
{}
