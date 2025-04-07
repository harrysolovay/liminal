import type { Action } from "./Action.ts"
import type { Actor } from "./Actor.ts"
import type { RunEmbed, RunInfer } from "./adapters.ts"
import type { EventHandler } from "./EventHandler.ts"
import type { LEvent } from "./events/LEvent.ts"
import type { Message } from "./Message.ts"
import type { Tool } from "./Tool.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export type Scope = RootScope | ChildScope

export interface RootScope extends ScopeBase<RootScopeType> {}
export interface ChildScope extends ScopeBase<ChildScopeType> {
  readonly parent: Scope
  readonly key: JSONKey
}

export type RootScopeType = "root"
export type ChildScopeType = "catch" | "tool" | "fork" | "fork_arm" | "set_messages"
export type ScopeType = RootScopeType | ChildScopeType

export interface ScopeBase<Type extends ScopeType> {
  readonly type: Type
  readonly args: Record<JSONKey, any>
  readonly controller: AbortController
  readonly messages: Set<Message>
  readonly tools: Set<Tool>
  readonly nextArg?: any
  readonly value: any
  readonly thrown?: any
  readonly runInfer: RunInfer
  readonly runEmbed?: RunEmbed

  reduce(this: Scope, actor: Actor): Promise<Scope>
  fork(source: ChildScopeType, key: JSONKey): Scope
  event(event: LEvent): void
}

export function RootScope(
  runInfer: RunInfer,
  args: Record<JSONKey, any>,
  event: EventHandler = () => {},
  signal?: AbortSignal,
): RootScope {
  const controller = new AbortController()
  signal?.addEventListener("abort", () => {
    controller.abort()
  })
  return {
    type: "root",
    args,
    controller,
    messages: new Set(),
    tools: new Set(),
    value: undefined,
    runInfer,
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
    this.event({
      type: "returned",
      value,
    })
  } catch (thrown: unknown) {
    scope.controller.abort(thrown)
  }
  return {
    ...scope,
    value,
    nextArg: undefined,
  }
}

function fork(this: Scope, type: ChildScopeType, key: JSONKey): ChildScope {
  return {
    type,
    controller: this.controller,
    args: this.args,
    messages: new Set(this.messages),
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
    type: "propagated",
    scopeType: this.type,
    scope: this.key,
    event,
  })
}
