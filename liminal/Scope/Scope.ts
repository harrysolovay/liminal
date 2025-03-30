import type { Actor } from "../Actor/Actor.js"
import type { ModelAdapters } from "../Config.js"
import type { Events } from "../Events.js"
import type { Message } from "../Message/Message.js"
import type { Tool } from "../Tool/Tool.js"

export class Scope<R = any> {
  constructor(
    readonly models: ModelAdapters,
    readonly key: keyof any | undefined,
    readonly actor: Actor,
    readonly events: Events,
    readonly model: {
      language?: keyof any
      embedding?: keyof any
    } = {},
    readonly messages: Array<Message> = [],
    readonly tools: Set<Tool> = new Set(),
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
      fields?.models ?? this.models,
      fields?.key ?? this.key,
      fields?.actor ?? this.actor,
      fields?.events ?? this.events,
      fields?.model ?? this.model,
      fields?.messages ?? this.messages,
      fields?.tools ?? this.tools,
      fields?.next ?? this.next,
      fields?.result ?? this.result,
      fields?.children ?? this.children,
    )
  }
}

export type ChildScopeContainer = {
  kind: "Context"
  scope: Scope
} | {
  kind: "Branches"
  key: keyof any
  scopes: Record<keyof any, Scope>
}
