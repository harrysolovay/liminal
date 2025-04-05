import type { ActionEvents } from "./ActionEvents.ts"
import type { ActionBase } from "./actions/actions_base.ts"
import type { EnableTool } from "./actions/EnableTool.ts"
import type { RunEmbed } from "./actions/SetEmbeddingModel.ts"
import type { RunInfer } from "./actions/SetLanguageModel.ts"
import type { Actor } from "./Actor.ts"
import type { Message } from "./Message.ts"

export type ScopeSource = "exec" | "tool" | "fork" | "fork_arm" | "set_messages"

export class Scope<R = any> {
  constructor(
    readonly source: ScopeSource,
    readonly args: Record<keyof any, any>,
    readonly key: keyof any | undefined,
    readonly events: ActionEvents,
    public runInfer: RunInfer | undefined = undefined,
    public runEmbed: RunEmbed | undefined = undefined,
    readonly messages: Array<Message> = [],
    readonly tools: Set<EnableTool> = new Set(),
    public next: any = undefined,
    public result: R = undefined!,
    public children: Array<Scope> = [],
  ) {}

  toJSON() {
    const { messages, key, events, children, result } = this
    return {
      key,
      events,
      children,
      result,
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
      fields?.result ?? this.result,
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
      result: currentActor.value,
      next: undefined,
    })
  }
}
