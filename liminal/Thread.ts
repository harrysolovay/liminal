import { Message } from "@effect/ai/AiInput"
import * as Brand from "effect/Brand"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { type Pipeable, pipeArguments } from "effect/Pipeable"
import * as PubSub from "effect/PubSub"
import * as Schema from "effect/Schema"
import type { Mutable } from "effect/Types"
import { self } from "./L/self1.ts"
import { sequence } from "./L/sequence.ts"
import type { LEvent } from "./LEvent.ts"
import type { NeverTool } from "./util/NeverTool.ts"
import { prefix } from "./util/prefix.ts"
import type { Sequencer } from "./util/Sequencer.ts"

export const ThreadNameTypeId: unique symbol = Symbol.for(prefix("ThreadNameTypeId"))
export type ThreadName = string & Brand.Brand<typeof ThreadNameTypeId>
export const ThreadName: Schema.brand<typeof Schema.String, typeof ThreadNameTypeId> = Schema.String.pipe(
  Schema.brand(ThreadNameTypeId),
)

export class ThreadState extends Schema.Class<ThreadState>(prefix("ThreadState"))({
  /** The key with which the thread is referenced by others. */
  name: Schema.Option(ThreadName),
  /** The system prompt to be passed along to the model. */
  system: Schema.Option(Schema.String),
  /** The messages based off of which the model infers the next message. */
  messages: Schema.Array(Message).pipe(Schema.mutable),
}) {
  static default = (): ThreadState =>
    ThreadState.make({
      name: Option.none(),
      system: Option.none(),
      messages: [],
    })
}

export interface ThreadInit {
  /** The parent thread. */
  readonly parent: Option.Option<Thread>
  /** The pubsub with which thread-specific events are emitted. */
  readonly events: PubSub.PubSub<LEvent>
  /** The state of the current thread. */
  readonly state: Mutable<ThreadState>
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
    ((...args) => sequence(...args).pipe(Effect.provideService(self, self))) satisfies Sequencer<Thread>,
    members,
  ) as Thread
  return self
}
