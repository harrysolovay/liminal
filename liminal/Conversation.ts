import { Message } from "@effect/ai/AiInput"
// import type { AiTool } from "@effect/ai/AiTool"
import * as Context from "effect/Context"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"

/** A context tag that denotes the boundary of a conversation isolate. */
export class Strand extends Context.Tag("liminal/Strand")<Strand, StrandValue>() {}

export interface StrandValue {
  /** The parent strand. */
  readonly parent: Option.Option<StrandValue>
  /** The pubsub with which the current strand's events are emitted. */
  readonly events: PubSub.PubSub<LEvent>
  /** The current system prompt to be passed along to the model. */
  system: Option.Option<string>
  /** The list of messages that the model uses to infer the next message. */
  messages: Array<Message>
  /** The tools available to the model. */
  // TODO: revisit
  // tools: Array<AiTool<string>>
}
