import type { SchemaObject } from "liminal-schema"
import { EventBase } from "./EventBase.ts"
import type { Message } from "./Message.ts"

export type LEvent = InferenceRequested | Inferred | MessageAppended | FiberCreated | FiberStarted | FiberResolved

export const LEventTag: unique symbol = Symbol.for("liminal/LEvent")
export type LEventTag = typeof LEventTag

export class InferenceRequested extends EventBase<LEventTag, "inference_requested"> {
  declare schema?: SchemaObject
  constructor(
    readonly requestId: number,
    schema?: SchemaObject | undefined,
  ) {
    super(LEventTag, "inference_requested")
    if (schema) {
      this.schema = schema
    }
  }
}

export class Inferred extends EventBase<LEventTag, "inferred"> {
  constructor(
    readonly requestId: number,
    readonly inference: string,
  ) {
    super(LEventTag, "inferred")
  }
}

export class MessageAppended extends EventBase<LEventTag, "message_appended"> {
  constructor(readonly message: Message) {
    super(LEventTag, "message_appended")
  }
}

export class FiberCreated extends EventBase<LEventTag, "fiber_created"> {
  constructor() {
    super(LEventTag, "fiber_created")
  }
}

export class FiberStarted extends EventBase<LEventTag, "fiber_started"> {
  constructor() {
    super(LEventTag, "fiber_started")
  }
}

export class FiberResolved extends EventBase<LEventTag, "fiber_resolved"> {
  constructor(readonly value: any) {
    super(LEventTag, "fiber_resolved")
  }
}

export function isLEvent(value: unknown): value is LEvent {
  return typeof value === "object" && value !== null && LEventTag in value
}
