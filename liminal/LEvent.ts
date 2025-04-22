import type { SchemaRoot } from "liminal-schema"
import type { Message } from "./Message.ts"

export type LEvent = InferenceRequested | Inferred | MessageAppended | FiberCreated | FiberStarted | FiberResolved

export interface InferenceRequested extends LEventBase<"inference_requested"> {
  requestId: number
  schema?: SchemaRoot
}

export interface Inferred extends LEventBase<"inferred"> {
  requestId: number
  inference: string
}

export interface MessageAppended extends LEventBase<"message_appended"> {
  message: Message
}

export interface FiberCreated extends LEventBase<"fiber_created"> {}
export interface FiberStarted extends LEventBase<"fiber_started"> {}
export interface FiberResolved extends LEventBase<"fiber_resolved"> {
  value: any
}

interface LEventBase<K extends string> {
  [LEventTag]: K
}

export const LEventTag: unique symbol = Symbol.for("liminal/LEvent")
export type LEventTag = typeof LEventTag

export function isLEvent(value: unknown): value is LEvent {
  return typeof value === "object" && value !== null && LEventTag in value
}
