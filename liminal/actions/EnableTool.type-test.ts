import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { AssertTrue, IsExact } from "conditional-type-checks"
import { ActorAssertions } from "../testing/ActorAssertions/ActorAssertions.ts"
import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions_common.ts"
import { context } from "./Context.ts"
import type { ToolDisabledEvent } from "./DisableTool.ts"
import { emit } from "./Emit.ts"
import type { EmittedEvent } from "./Emit.ts"
import { enableTool, type ToolCalledEvent, type ToolEnabledEvent } from "./EnableTool.ts"

type P = {
  a: string
  b: string
}

const arrowTool = enableTool("Tool", "", null! as StandardSchemaV1<P>, (params) => {
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

const genTool = enableTool("Tool", "", null! as StandardSchemaV1<P>, function*(params) {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
  yield* emit("Test", {})
  return ""
})

ActorAssertions(genTool).assertSpec<{
  Entry: never
  Event:
    | ToolEnabledEvent<"Tool">
    | ChildEvent<"tool", "Tool", ToolCalledEvent<P> | EnteredEvent | EmittedEvent<"Test", {}> | ExitedEvent<string>>
}>()

function* parent() {
  yield* enableTool("ParentTool", "", null! as StandardSchemaV1<P>, () => {})
  yield* context("Context", function*() {
    yield* arrowTool
  })
}

ActorAssertions(parent).assertSpec<{
  Entry: never
  Event:
    | ToolEnabledEvent<"ParentTool">
    | ChildEvent<"tool", "ParentTool", EnteredEvent | ToolCalledEvent<P> | ExitedEvent<void>>
    | ChildEvent<
      "context",
      "Context",
      | EnteredEvent
      | ToolEnabledEvent<"Tool">
      | ExitedEvent<void>
      | ChildEvent<"tool", "Tool", EnteredEvent | ToolCalledEvent<P> | ExitedEvent<void>>
    >
}>()
