import type { Action } from "./Action.ts"
import type { Actor } from "./Actor.ts"
import type { RunEmbed, RunInfer } from "./adapters.ts"
import type { EventHandler } from "./EventHandler.ts"
import type { LEvent } from "./events/LEvent.ts"
import type { Message } from "./Message.ts"
import type { Tool } from "./Tool.ts"

export type Scope = RootScope | ChildScope

export interface RootScope extends ScopeBase<RootScopeType> {}
export interface ChildScope extends ScopeBase<ChildScopeType> {
  readonly parent: Scope
}

export type RootScopeType = "module" | "exec"
export type ChildScopeType = "catch" | "tool" | "fork" | "fork_arm" | "set_messages"
export type ScopeType = RootScopeType | ChildScopeType

export interface ScopeBase<Type extends ScopeType> {
  readonly type: Type
  readonly key: keyof any
  readonly args: Record<keyof any, any>
  readonly controller: AbortController
  readonly messages: Array<Message>
  readonly tools: Set<Tool>
  readonly nextArg?: any
  readonly value: any
  readonly thrown?: any
  readonly runInfer?: RunInfer
  readonly runEmbed?: RunEmbed

  reduce(this: Scope, actor: Actor): Promise<Scope>
  fork(source: ChildScopeType, key: keyof any): Scope
  event(event: LEvent): void
}

export function RootScope(
  type: RootScopeType,
  key: string,
  args: Record<keyof any, any>,
  event: EventHandler = () => {},
): RootScope {
  return {
    type,
    key,
    args,
    controller: new AbortController(),
    messages: [],
    tools: new Set(),
    value: undefined,
    reduce,
    fork,
    event,
  }
}

async function reduce(this: Scope, actor: Actor): Promise<Scope> {
  const { signal } = this.controller
  let scope = { ...this }
  if (signal.aborted) return scope
  let value: unknown
  try {
    let current = await actor.next()
    while (!current.done) {
      const { value } = current
      if (signal.aborted) return scope
      scope = await (value as Action).reducer(scope)
      if (signal.aborted) return scope
      current = await actor.next(scope.nextArg)
    }
    value = current.value
  } catch (thrown: unknown) {
    scope.controller.abort(thrown)
  }
  return {
    ...scope,
    value,
    nextArg: undefined,
  }
}

function fork(this: Scope, type: ChildScopeType, key: keyof any): ChildScope {
  return {
    type,
    controller: this.controller,
    args: this.args,
    messages: [...this.messages],
    tools: new Set(),
    runInfer: this.runInfer,
    runEmbed: this.runEmbed,
    key,
    parent: this,
    value: undefined,
    reduce,
    fork,
    event,
  }
}

function event(this: ChildScope, event: LEvent): void {
  this.parent.event({
    type: "event_propagated",
    scopeType: this.type,
    scope: this.key,
    event,
  })
}
