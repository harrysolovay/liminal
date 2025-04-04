import type { AssertTrue, IsExact } from "conditional-type-checks"
import * as L from "../L.ts"
import { ActorAssertions } from "../testing/ActorAssertions/ActorAssertions.ts"
import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions_common.ts"
import type { ToolDisabledEvent } from "./DisableTool.ts"
import { emit } from "./Emit.ts"
import type { EmittedEvent } from "./Emit.ts"
import { enableTool, type ToolCalledEvent, type ToolEnabledEvent } from "./EnableTool.ts"

type P = typeof P["T"]
const P = L.object({
  a: L.string,
  b: L.string,
})

const arrowTool = L.enableTool("Tool", "", P, (params) => {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
})

ActorAssertions(arrowTool).assertSpec<{
  Entry: never
  Event: ToolEnabledEvent<"Tool"> | ChildEvent<"tool", "Tool", EnteredEvent | ToolCalledEvent<P> | ExitedEvent<void>>
}>()

function* _0() {
  const detach = yield* arrowTool
  ActorAssertions(detach).assertSpec<{
    Entry: never
    Event: ToolDisabledEvent<"Tool">
  }>()
}

const genTool = enableTool("tool-key", "", P, function*(params) {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
  yield* emit("Test", {})
  return ""
})

ActorAssertions(genTool).assertSpec<{
  Entry: never
  Event:
    | ToolEnabledEvent<"tool-key">
    | ChildEvent<
      "tool",
      "tool-key",
      | EnteredEvent
      | EmittedEvent<"Test", {}>
      | ToolCalledEvent<{
        a: string
        b: string
      }>
      | ExitedEvent<string>
    >
}>()

function* parent() {
  yield* L.enableTool("parent-tool", "", P, () => {})
  yield* L.fork("fork-key", {
    *"arm-key"() {
      yield* arrowTool
    },
  })
}

ActorAssertions(parent).assertSpec<{
  Entry: never
  Event:
    | ToolEnabledEvent<"parent-tool">
    | ChildEvent<
      "tool",
      "parent-tool",
      | EnteredEvent
      | ToolCalledEvent<{
        a: string
        b: string
      }>
      | ExitedEvent<void>
    >
    | ChildEvent<
      "fork",
      "fork-key",
      | EnteredEvent
      | ChildEvent<
        "fork_arm",
        "arm-key",
        | EnteredEvent
        | ToolEnabledEvent<"Tool">
        | ExitedEvent<void>
        | ChildEvent<
          "tool",
          "Tool",
          | EnteredEvent
          | ToolCalledEvent<{
            a: string
            b: string
          }>
          | ExitedEvent<void>
        >
      >
      | ExitedEvent<{
        "arm-key": void
      }>
    >
}>()
