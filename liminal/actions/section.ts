import { Action } from "../Action.ts"
import type { Agent, AgentLike } from "../Agent.ts"
import type { SectionCleared } from "../events/SectionCleared.ts"
import type { Sectioned } from "../events/Sectioned.ts"
import type { Message } from "../Message.ts"
import type { Section } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export interface section<K extends JSONKey> extends Action<"section", Spec.Make<{ Event: Sectioned<K> }>> {}

export interface SectionHandle<K extends JSONKey> {
  clear: Generator<Action<"clear_section", Spec.Make<{ Event: SectionCleared<K> }>>, void>
  getMessages: () => Generator<Action<"get_section_messages", never>, Set<Message>>

  <L extends JSONKey, Y extends Action, T>(key: L, agentLike: AgentLike<Y, T>): Generator<
    Action<
      "run_section",
      Spec.Make<{
        Child: [L, Y[""]]
        Entry: Y[""]["Entry"]
        Value: T
      }>
    >,
    T
  >
}

export function* section<K extends JSONKey>(sectionKey: K): Generator<section<K>, SectionHandle<K>> {
  return yield Action("section", (scope) => {
    scope.event({
      type: "sectioned",
      sectionKey,
    })
    const section: Section = {
      sectionKey,
      messages: new Set(),
    }
    scope.sections.add(section)
    return {
      ...scope,
      nextArg: Object.assign(
        function*<L extends JSONKey, Y extends Action, T>(key: L, agentLike: AgentLike<Y, T>): Generator<
          Action<
            "run_section",
            Spec.Make<{
              Child: [L, Y[""]]
              Entry: Y[""]["Entry"]
              Value: T
            }>
          >,
          T
        > {
          return yield Action("run_section", async (scope) => {
            const sectionScope = scope.fork("run_section", [key], {
              messages: new Set(section.messages),
            })
            const reduced = await sectionScope.reduce(unwrapDeferred(agentLike))
            const { value } = reduced
            sectionScope.event({
              type: "returned",
              value,
            })
            return {
              ...scope,
              nextArg: value,
            }
          })
        },
        {
          getMessages: (function*(): Generator<Action<"get_section_messages", never>, Set<Message>> {
            return yield Action("get_section_messages", (scope) => ({
              ...scope,
              nextArg: new Set(section.messages),
            }))
          })(),
        },
        {
          clear:
            (function*(): Generator<Action<"clear_section", Spec.Make<{ Event: SectionCleared<K> }>>, Set<Message>> {
              return yield Action("clear_section", (scope) => {
                const sections = new Set(scope.sections)
                sections.delete(section)
                const messages = new Set(scope.messages)
                section.messages.forEach((message) => {
                  messages.delete(message)
                })
                scope.event({
                  type: "section_cleared",
                  sectionKey,
                })
                return {
                  ...scope,
                  nextArg: messages,
                  sections,
                  messages,
                }
              })
            })(),
        },
      ),
    }
  })
}
