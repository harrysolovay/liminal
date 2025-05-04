import type { Adapter } from "./Adapter.ts"
import { EventBase } from "./EventBase.ts"
import type { Message } from "./Message.ts"
import type { Schema } from "./Schema.ts"
import type { StrandStatus } from "./Strand.ts"

export type LEvent =
  | AdapterFocused
  | InferenceRequested
  | Inferred
  | MessageAppended
  | StrandStatusChanged

export namespace LEvent {
  export function is(value: unknown): value is LEvent {
    return typeof value === "object" && value !== null && "brand" in value && value.brand === LEventTag
  }
}

export const LEventTag: unique symbol = Symbol.for("liminal/LEvent")
export type LEventTag = typeof LEventTag

export class AdapterFocused extends EventBase(LEventTag, "adapter_focused") {
  constructor(readonly adapter: Adapter) {
    super()
  }
}

export class InferenceRequested extends EventBase(LEventTag, "inference_requested") {
  declare schema?: Schema
  constructor(
    readonly requestId: string,
    schema?: Schema | undefined,
  ) {
    super()
    if (schema) {
      this.schema = schema
    }
  }
}

export class Inferred extends EventBase(LEventTag, "inferred") {
  constructor(
    readonly requestId: string,
    readonly inference: string,
  ) {
    super()
  }
}

export class MessageAppended extends EventBase(LEventTag, "message_appended") {
  constructor(readonly message: Message) {
    super()
  }
}

export class StrandStatusChanged extends EventBase(LEventTag, "strand_status_changed") {
  constructor(readonly status: StrandStatus) {
    super()
  }
}
