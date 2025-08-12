import type { Message } from "@effect/ai/AiInput"
import * as Context from "effect/Context"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import { type Pipeable, pipeArguments } from "effect/Pipeable"
import * as Schema from "effect/Schema"
import { prefix } from "./util/prefix.ts"
import type { Sequencer } from "./util/Sequencer.ts"

const ident = prefix("Thread")

export const ThreadTypeId: unique symbol = Symbol.for(ident)
export type ThreadTypeId = typeof ThreadTypeId

export const ThreadIdTypeId: unique symbol = Symbol.for(prefix("ThreadId"))
export const ThreadId = Schema.String.pipe(Schema.brand(ThreadIdTypeId))
export type ThreadId = typeof ThreadId

export interface Thread extends Pipeable, Sequencer<Thread> {
  readonly [ThreadTypeId]: ThreadTypeId

  readonly parent: Option.Option<Thread>

  id: Option.Option<ThreadId>

  system: Option.Option<string>

  messages: Array<Message>
}

export const threadTag: Context.Tag<Thread, Thread> = Context.GenericTag<Thread>(ident)

export interface ThreadInit {
  id?: ThreadId | undefined
  system?: string | undefined
  messages?: Array<Message> | undefined
}

export const Thread = (init?: ThreadInit): Thread =>
  Object.assign(
    () => {
      throw 0
    },
    {
      [ThreadTypeId]: ThreadTypeId,
      id: Option.fromNullable(init?.id),
      parent: Option.none(),
      system: Option.fromNullable(init?.system),
      messages: [...init?.messages ?? []],
      pipe() {
        return pipeArguments(this, arguments)
      },
    } satisfies Omit<Thread, keyof (() => {})>,
  )

export declare const threadLayer: (init?: ThreadInit) => Layer.Layer<Thread>
