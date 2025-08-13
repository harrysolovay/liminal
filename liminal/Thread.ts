import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { type Pipeable, pipeArguments } from "effect/Pipeable"
import * as PubSub from "effect/PubSub"
import * as Schema from "effect/Schema"
import type { Mutable } from "effect/Types"
import { Self } from "./L/Self.ts"
import { sequence } from "./L/sequence.ts"
import type { LEvent } from "./LEvent.ts"
import type { NeverTool } from "./util/NeverTool.ts"
import { prefix } from "./util/prefix.ts"
import type { Sequencer } from "./util/Sequencer.ts"

export const ThreadFqnTypeId: unique symbol = Symbol.for(prefix("ThreadFqn"))
export const ThreadFqn = Schema.String.pipe(Schema.brand(ThreadFqnTypeId))
export type ThreadFqn = typeof ThreadFqn["Type"]

export class ThreadState extends Schema.Class<ThreadState>(prefix("ThreadState"))({
  /** The key with which the thread is referenced by others. */
  fqn: Schema.Option(ThreadFqn),
  /** The system prompt to be passed along to the model. */
  system: Schema.Option(Schema.String),
  /** The messages based off of which the model infers the next message. */
  messages: Schema.Array(Message).pipe(Schema.mutable),
}) {
  static default = (): ThreadState =>
    ThreadState.make({
      fqn: Option.none(),
      system: Option.none(),
      messages: [],
    })
}

export interface ThreadInit {
  /** The parent thread. */
  parent: Option.Option<Thread>
  /** The pubsub with which thread-specific events are emitted. */
  events: PubSub.PubSub<LEvent>
  /** The state of the current thread. */
  state: Mutable<ThreadState>
  /** The tools to be made accessible to the model. */
  tools: Option.Option<Set<NeverTool>>
}

export const ThreadTypeId: unique symbol = Symbol.for(prefix("Thread"))
export type ThreadTypeId = typeof ThreadTypeId

interface ThreadMembers extends ThreadInit, Pipeable {
  readonly [ThreadTypeId]: ThreadTypeId
}

/** A conversation isolate. */
export interface Thread extends Sequencer<Thread>, ThreadMembers {}

export const Thread = (init: ThreadInit): Thread => {
  const members = {
    [ThreadTypeId]: ThreadTypeId,
    ...init,
    pipe() {
      return pipeArguments(self, arguments)
    },
  } satisfies ThreadMembers
  const self = Object.assign(
    ((...args) => sequence(...args).pipe(Effect.provideService(Self, self))) satisfies Sequencer<Thread>,
    members,
  ) as Thread
  return self
}
