import type { SchemaObject } from "liminal-schema"
import { EventBase } from "./EventBase.ts"
import type { Message } from "./Message.ts"
import type { Model } from "./Model.ts"

export type LEvent =
  | FiberCreated
  | FiberResolved
  | FiberStarted
  | InferenceRequested
  | Inferred
  | MessageAppended
  | ModelRegistered

export namespace LEvent {
  export function is(value: unknown): value is LEvent {
    return typeof value === "object" && value !== null && "brand" in value && value.brand === LEventTag
  }
}

export const LEventTag: unique symbol = Symbol.for("liminal/LEvent")
export type LEventTag = typeof LEventTag

export class ModelRegistered extends EventBase(LEventTag, "model_registered") {
  constructor(readonly model: Model) {
    super()
  }
}

export class InferenceRequested extends EventBase(LEventTag, "inference_requested") {
  declare schema?: SchemaObject
  constructor(
    readonly requestId: number,
    schema?: SchemaObject | undefined,
  ) {
    super()
    if (schema) {
      this.schema = schema
    }
  }
}

export class Inferred extends EventBase(LEventTag, "inferred") {
  constructor(
    readonly requestId: number,
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

export class FiberCreated extends EventBase(LEventTag, "fiber_created") {}
export class FiberStarted extends EventBase(LEventTag, "fiber_started") {}
export class FiberResolved extends EventBase(LEventTag, "fiber_resolved") {
  constructor(readonly value: any) {
    super()
  }
}
export class FiberRejected extends EventBase(LEventTag, "fiber_rejected") {
  constructor(readonly reason: any) {
    super()
  }
}
