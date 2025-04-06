import type { ActionBase } from "./actions/actions_base.ts"
import type { EnableTool } from "./actions/EnableTool.ts"
import type { RunEmbed } from "./actions/SetEmbeddingModel.ts"
import type { RunInfer } from "./actions/SetLanguageModel.ts"
import type { Actor } from "./Actor.ts"
import type { Events } from "./Events.ts"
import type { Message } from "./Message.ts"

export type ScopeSource = "try" | "catch" | "module" | "exec" | "tool" | "fork" | "fork_arm" | "set_messages"

export class Scope<R = any> {
  constructor(
    readonly source: ScopeSource,
    readonly args: Record<keyof any, any>,
    readonly key: keyof any | undefined,
    readonly events: Events,
    public runInfer: RunInfer | undefined = undefined,
    public runEmbed: RunEmbed | undefined = undefined,
    readonly messages: Array<Message> = [],
    readonly tools: Set<EnableTool> = new Set(),
    public next: any = undefined,
    public value: R = undefined!,
    public children: Array<Scope> = [],
  ) {}

  toJSON() {
    const { messages, key, events, children, value } = this
    return {
      key,
      events,
      children,
      value,
      ...messages.length ? { messages } : {},
    }
  }

  spread = (fields?: Partial<Scope<R>>): Scope<R> => {
    return new Scope(
      fields?.source ?? this.source,
      fields?.args ?? this.args,
      fields?.key ?? this.key,
      fields?.events ?? this.events,
      fields?.runInfer ?? this.runInfer,
      fields?.runEmbed ?? this.runEmbed,
      fields?.messages ?? this.messages,
      fields?.tools ?? this.tools,
      fields?.next ?? this.next,
      fields?.value ?? this.value,
      fields?.children ?? this.children,
    )
  }

  reduce = async (actor: Actor): Promise<Scope> => {
    let currentScope: Scope<any> = this
    let currentActor = await actor.next()
    while (!currentActor.done) {
      const { value } = currentActor
      currentScope = await (value as ActionBase).reduce(currentScope)
      currentActor = await actor.next(currentScope.next)
    }
    return currentScope.spread({
      value: currentActor.value,
      next: undefined,
    })
  }

  fork(source: ScopeSource, key: keyof any): Scope {
    return new Scope(
      source,
      this.args,
      key,
      this.events.child((event) => ({
        type: "event_propagated",
        scopeType: source,
        scope: key,
        event,
      })),
      this.runInfer,
      this.runEmbed,
      [...this.messages],
    )
  }
}
