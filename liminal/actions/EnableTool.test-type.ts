import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { AssertTrue, IsExact } from "conditional-type-checks"
import { ActorAssertions } from "../testing/ActorAssertions/ActorAssertions.ts"
import type { EnteredEvent, ExitedEvent } from "./actions_base.ts"
import { context } from "./Context.ts"
import type { ContextEvent } from "./Context.ts"
import type { ToolDisabledEvent } from "./DisableTool.ts"
import { emit } from "./Emit.ts"
import type { EmittedEvent } from "./Emit.ts"
import { enableTool, type ToolCalledEvent, type ToolEnabledEvent, type ToolEvent } from "./EnableTool.ts"

type P = {
  a: string
  b: string
}

const arrowTool = enableTool("Tool", "", null! as StandardSchemaV1<P>, (params) => {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
})

ActorAssertions(arrowTool).assertSpec<{
  Field: never
  Event: ToolEnabledEvent<"Tool"> | ToolEvent<"Tool", EnteredEvent | ToolCalledEvent<P> | ExitedEvent<void>>
}>()

function* _0() {
  const detach = yield* arrowTool
  ActorAssertions(detach).assertSpec<{
    Field: never
    Event: ToolDisabledEvent<"Tool">
  }>()
}

const genTool = enableTool("Tool", "", null! as StandardSchemaV1<P>, function*(params) {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
  yield* emit("Test", {})
  return ""
})

ActorAssertions(genTool).assertSpec<{
  Field: never
  Event:
    | ToolEnabledEvent<"Tool">
    | ToolEvent<"Tool", ToolCalledEvent<P> | EnteredEvent | EmittedEvent<"Test", {}> | ExitedEvent<string>>
}>()

function* parent() {
  yield* enableTool("ParentTool", "", null! as StandardSchemaV1<P>, () => {})
  yield* context("Context", function*() {
    yield* arrowTool
  })
}

ActorAssertions(parent).assertSpec<{
  Field: never
  Event:
    | ToolEnabledEvent<"ParentTool">
    | ToolEvent<"ParentTool", EnteredEvent | ToolCalledEvent<P> | ExitedEvent<void>>
    | ContextEvent<
      "Context",
      | EnteredEvent
      | ToolEnabledEvent<"Tool">
      | ExitedEvent<void>
      | ToolEvent<"Tool", EnteredEvent | ToolCalledEvent<P> | ExitedEvent<void>>
    >
}>()
