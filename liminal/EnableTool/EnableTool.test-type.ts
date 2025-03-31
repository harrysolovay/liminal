import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { AssertTrue, IsExact } from "conditional-type-checks"
import { Context } from "../Context/Context.ts"
import type { ContextEnteredEvent, ContextExitedEvent, ContextInnerEvent } from "../Context/ContextEvent.ts"
import type { ToolDisabledEvent } from "../DisableTool/DisableToolEvent.ts"
import { Emit } from "../Emit/Emit.ts"
import type { EmittedEvent } from "../Emit/EmitEvent.ts"
import { ActorAssertions } from "../testing/ActorAssertions.ts"
import { EnableTool } from "./EnableTool.ts"
import type { ToolEnabledEvent, ToolEnteredEvent, ToolExitedEvent, ToolInnerEvent } from "./EnableToolEvent.ts"

type P = {
  a: string
  b: string
}

const arrowTool = EnableTool("Tool", "", null! as StandardSchemaV1<P>, (params) => {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
})
ActorAssertions(arrowTool).assertSpec<{
  LanguageModel: never
  EmbeddingModel: never
  Event:
    | ToolEnabledEvent<"Tool">
    | ToolEnteredEvent<"Tool", P>
    | ToolInnerEvent<"Tool", never>
    | ToolExitedEvent<"Tool", void>
}>()

function* _0() {
  const detach = yield* arrowTool
  ActorAssertions(detach).assertSpec<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolDisabledEvent<"Tool">
  }>()
}

const genTool = EnableTool("Tool", "", null! as StandardSchemaV1<P>, function*(params) {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
  yield* Emit("Test", {})
  return ""
})

ActorAssertions(genTool).assertSpec<{
  LanguageModel: never
  EmbeddingModel: never
  Event:
    | ToolEnabledEvent<"Tool">
    | ToolEnteredEvent<"Tool", P>
    | ToolInnerEvent<"Tool", EmittedEvent<"Test", {}>>
    | ToolExitedEvent<"Tool", string>
}>()

function* parent() {
  yield* EnableTool("ParentTool", "", null! as StandardSchemaV1<P>, () => {})
  yield* Context("Context", function*() {
    yield* arrowTool
  })
}

ActorAssertions(parent).assertSpec<{
  LanguageModel: never
  EmbeddingModel: never
  Event:
    | ToolEnabledEvent<"ParentTool">
    | ToolEnteredEvent<"ParentTool", P>
    | ToolInnerEvent<"ParentTool", never>
    | ToolExitedEvent<"ParentTool", void>
    | ContextEnteredEvent<"Context">
    | ContextInnerEvent<
      "Context",
      | ToolEnabledEvent<"Tool">
      | ToolEnteredEvent<"Tool", P>
      | ToolInnerEvent<"Tool", never>
      | ToolExitedEvent<"Tool", void>
    >
    | ContextExitedEvent<"Context", void>
}>()
