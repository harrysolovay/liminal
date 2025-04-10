import type { JSONKey } from "../util/JSONKey.ts"
import type { EventBase } from "./EventBase.ts"

export interface SectionCleared<K extends JSONKey = JSONKey> extends EventBase<"section_cleared"> {
  sectionKey: K
}
