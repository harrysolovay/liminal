import type { AssertTrue, IsExact } from "conditional-type-checks"
import type { Emitted } from "../events/Emitted.ts"
import type { ToolCalled } from "../events/ToolCalled.ts"
import type { ToolDisabled } from "../events/ToolDisabled.ts"
import type { ToolEnabled } from "../events/ToolEnabled.ts"
import * as L from "../L.ts"
import type { MakeSpec } from "../Spec.ts"
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

ActorAssertions(arrowTool).assertSpec<
  MakeSpec<{
    Event:
      | ToolEnabled<"Tool">
      | ToolCalled<"Tool", {
        a: string
        b: string
      }>
  }>
>()

function* _0() {
  const detach = yield* arrowTool
  ActorAssertions(detach).assertSpec<
    MakeSpec<{
      Event: ToolDisabled<"Tool">
    }>
  >()
}

const genTool = enableTool("tool-key", "", P, function*(params) {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
  yield* emit("Test", {})
  return ""
})

ActorAssertions(genTool).assertSpec<
  MakeSpec<{
    Event:
      | ToolEnabled<"tool-key">
      | ToolCalled<"tool-key", {
        a: string
        b: string
      }>
    Child: [
      "tool-key",
      MakeSpec<{
        Event: Emitted<"Test", {}>
      }>,
    ]
    Entry: never
  }>
>()

const g = L.branch("fork-key", {
  *"arm-key"() {
    yield* arrowTool
  },
})

function* parent() {
  yield* L.enableTool("parent-tool", "", P, () => {})
  yield* L.branch("fork-key", {
    *"arm-key"() {
      yield* arrowTool
    },
  })
}

ActorAssertions(parent).assertSpec<
  | MakeSpec<{
    Event:
      | ToolEnabled<"parent-tool">
      | ToolCalled<"parent-tool", {
        a: string
        b: string
      }>
  }>
  | MakeSpec<{
    Child: [
      "fork-key",
      MakeSpec<{
        Child: [
          "arm-key",
          MakeSpec<{
            Event:
              | ToolEnabled<"Tool">
              | ToolCalled<"Tool", {
                a: string
                b: string
              }>
          }>,
        ]
        Entry: never
      }>,
    ]
    Entry: never
  }>
>()
