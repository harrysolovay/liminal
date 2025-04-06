import type { EventBase } from "./_EventBase.ts"

export interface EmittedEvent<K extends keyof any = keyof any, E = any> extends EventBase<"emitted"> {
  key: K
  value: E
}
