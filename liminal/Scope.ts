import type { ActionEvents } from "./ActionEvents.ts"
import type { EnableTool } from "./actions/EnableTool.ts"
import type { Message } from "./actions/Message.ts"
import type { RunEmbed } from "./actions/SetEmbeddingModel.ts"
import type { RunInfer } from "./actions/SetLanguageModel.ts"

export class Scope<R = any> {
  constructor(
    readonly args: Record<keyof any, any>,
    readonly key: keyof any | undefined,
    readonly events: ActionEvents,
    public runInfer: RunInfer | undefined = undefined,
    public runEmbed: RunEmbed | undefined = undefined,
    readonly messages: Array<Message> = [],
    readonly tools: Set<EnableTool> = new Set(),
    public next: any = undefined,
    public result: R = undefined!,
    public children: Array<ChildScopeContainer> = [],
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
}

// TODO: how to capture tool scope?
export type ChildScopeContainer = {
  type: "context"
  scope: Scope
} | {
  type: "fork"
  key: keyof any
  scopes: Record<keyof any, Scope>
}
