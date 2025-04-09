import type { AssertTrue, IsExact } from "conditional-type-checks"
import type { ActorLike } from "../Actor.ts"
import type { Emitted } from "../events/Emitted.ts"
import type { ToolCalled } from "../events/ToolCalled.ts"
import type { ToolDisabled } from "../events/ToolDisabled.ts"
import type { ToolEnabled } from "../events/ToolEnabled.ts"
import * as L from "../L.ts"
import { ActorAssertions } from "../testing/ActorAssertions.ts"
import { emit } from "./emit.ts"
import { enableTool } from "./enableTool.ts"

type P = typeof P["T"]
const P = L.object({
  a: L.string,
  b: L.string,
})

const arrowTool = L.enableTool("Tool", "", P, (params) => {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
})

ActorAssertions(arrowTool).assertSpec<{
  Event:
    | ToolEnabled<"Tool">
    | ToolCalled<"Tool", {
      a: string
      b: string
    }>
  Child: never
  Throw: never
  Entry: never
  Value: never
}>()

function* _0() {
  const detach = yield* arrowTool
  ActorAssertions(detach).assertSpec<{
    Event: ToolDisabled<"Tool">
    Child: never
    Throw: never
    Entry: never
    Value: never
  }>()
}

const genTool = enableTool("tool-key", "", P, function*(params) {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
  yield* emit("Test")
  return ""
})

ActorAssertions(genTool).assertSpec<{
  Event:
    | ToolEnabled<"tool-key">
    | ToolCalled<"tool-key", {
      a: string
      b: string
    }>
  Child: ["tool-key", {
    Event: Emitted<"Test">
    Child: never
    Throw: never
    Entry: never
    Value: never
  }]
  Throw: never
  Entry: never
  Value: string
}>()

function* parent() {
  yield* L.enableTool("parent-tool", "", P, () => {})
  yield* L.branch("fork-key", {
    *"arm-key"() {
      yield* arrowTool
    },
  })
}

type g = typeof parent extends ActorLike<infer Y> ? Y[""] : never

ActorAssertions(parent).assertSpec<
  {
    Event:
      | ToolEnabled<"parent-tool">
      | ToolCalled<"parent-tool", {
        a: string
        b: string
      }>
    Child: never
    Throw: never
    Entry: never
    Value: never
  } | {
    Event: never
    Child: ["fork-key", {
      Event: never
      Child: ["arm-key", {
        Event:
          | ToolEnabled<"Tool">
          | ToolCalled<"Tool", {
            a: string
            b: string
          }>
        Child: never
        Throw: never
        Entry: never
        Value: never
      }]
      Throw: never
      Entry: never
      Value: void
    }]
    Throw: never
    Entry: never
    Value: never
  }
>()
