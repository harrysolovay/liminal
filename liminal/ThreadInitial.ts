import type { Message } from "@effect/ai/AiInput"
import type * as AiTool from "@effect/ai/AiTool"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import * as Schema from "effect/Schema"
import type { LEvent } from "./LEvent.ts"
import { prefix } from "./util/prefix.ts"
import type { Sequencer } from "./util/Sequencer.ts"

export const ThreadTypeId: unique symbol = Symbol.for(prefix("Thread"))

export const ThreadIdTypeId: unique symbol = Symbol.for(prefix("ThreadId"))

export type ThreadId = typeof ThreadId.Type
export const ThreadId = Schema.String.pipe(Schema.brand(ThreadIdTypeId))

export declare namespace Thread {
  export interface Service extends Sequencer<Thread> {
    [ThreadTypeId]: typeof ThreadTypeId
    /** The unique ID of the thread. */
    id: ThreadId
    /** The parent conversation. */
    readonly parent: Option.Option<Service>
    /** The pubsub with which the current conversation's events are emitted. */
    readonly events: PubSub.PubSub<LEvent>
    /** The current system prompt to be passed along to the model. */
    system: Option.Option<string>
    /** The list of messages that the model uses to infer the next message. */
    messages: Array<Message>
    /** The tools available to the model. */
    tools: Set<AiTool.AiTool<string, AiTool.AnyStructSchema, Schema.Schema.Any, Schema.Schema.Any, never>>
  }
}

/** A context tag that denotes the boundary of a conversation isolate. */
export class Thread extends Context.Tag(prefix("Thread"))<Thread, Thread.Service>() {
  static layer: <T extends AiTool.Any = never>(init?: {
    id?: ThreadId | undefined
    system?: string | undefined
    messages?: Array<Message> | undefined
    tools?: Set<T> | undefined
  }) => Layer.Layer<
    Thread,
    [T] extends [AiTool.Any] ? AiTool.Failure<T> : never,
    [T] extends [AiTool.Any] ? AiTool.Context<T> : never
  > = ({ id, system, messages, tools } = {}) =>
    Layer.effect(
      Thread,
      Effect.gen(function*() {
        return Thread.of(Object.assign({
          [ThreadTypeId]: ThreadTypeId,
          id: id ?? ThreadId.make("TODO"),
          parent: yield* Effect.serviceOption(Thread),
          events: yield* PubSub.unbounded<LEvent>(),
          system: Option.fromNullable(system),
          messages: [...messages ?? []],
          tools: new Set(tools as never ?? []),
        }))
      }),
    )
}
