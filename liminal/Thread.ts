import { Message } from "@effect/ai/AiInput"
import * as Brand from "effect/Brand"
import * as Effect from "effect/Effect"
import * as FiberSet from "effect/FiberSet"
import * as Option from "effect/Option"
import * as Pipeable from "effect/Pipeable"
import * as PubSub from "effect/PubSub"
import * as Schema from "effect/Schema"
import * as Scope from "effect/Scope"
import type { Mutable } from "effect/Types"
import { line } from "./L/line.ts"
import { self } from "./L/self.ts"
import type { LEvent } from "./LEvent.ts"
import type { NeverTool } from "./util/NeverTool.ts"
import { prefix } from "./util/prefix.ts"

export const ThreadIdTypeId: unique symbol = Symbol.for(prefix("ThreadNameTypeId"))
export type ThreadId = string & Brand.Brand<typeof ThreadIdTypeId>
export const ThreadId: Schema.brand<typeof Schema.String, typeof ThreadIdTypeId> = Schema.String.pipe(
  Schema.brand(ThreadIdTypeId),
)

export class ThreadState extends Schema.Class<ThreadState>(prefix("ThreadState"))({
  /** The system prompt to be passed along to the model. */
  system: Schema.Option(Schema.String),
  /** The messages based off of which the model infers the next message. */
  messages: Schema.Array(Message).pipe(Schema.mutable),
}) {
  static default = (): ThreadState =>
    ThreadState.make({
      system: Option.none(),
      messages: [],
    })
}

export interface ThreadInit {
  /** Scope representing the thread's lifetime. */
  readonly scope: Scope.Scope
  /** The unique id of the thread. */
  readonly id: ThreadId
  /** The parent thread. */
  readonly parent: Option.Option<Thread>
  /** The pubsub with which thread-specific events are emitted. */
  readonly events: PubSub.PubSub<LEvent>
  /** Child fibers, such as event handlers and digests. */
  readonly fibers: FiberSet.FiberSet<void, never>
  /** The state of the current thread. */
  readonly state: Mutable<ThreadState>
  /** The tools to be made accessible to the model. */
  tools: Option.Option<Set<NeverTool>>
}

interface ThreadMembers extends ThreadInit {
  scoped: <A, E, R>(x: Effect.Effect<A, E, R>) => Effect.Effect<A, E, Exclude<R, Scope.Scope>>
}

/** A conversation isolate. */
export interface Thread extends line<Thread>, ThreadMembers, Effect.Effect<ThreadId> {}

export const Thread = (init: ThreadInit): Thread => {
  const members = {
    ...init,
    scoped: Effect.provideService(Scope.Scope, init.scope),
  } satisfies ThreadMembers
  const self_ = Object.assign(
    ((...args) => line(...args).pipe(Effect.provideService(self, self_))) satisfies line<Thread>,
    Effect.succeed(init.id),
    members,
    {
      pipe() {
        return Pipeable.pipeArguments(this, arguments)
      },
    },
  ) as Thread
  return self_
}
