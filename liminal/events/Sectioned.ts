import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./EventBase.ts"

export interface Sectioned<K extends JSONKey = JSONKey> extends EventBase<"sectioned"> {
  sectionKey: K
}
