import { Tool, type EnableToolEvent, type ToolCallEvent } from "./Tool.js"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { IsExact, AssertTrue } from "conditional-type-checks"
import type { DisableToolEvent } from "./DisableTool.js"
import { AssertionScope } from "../testing/index.js"
import type { EnterEvent, ExitEvent } from "./event_common.js"
import { Context, type ContextEvent } from "./Context.js"

AssertionScope((assert) => {
  type P = {
    a: string
    b: string
  }

  const arrowTool = Tool("Tool", "", null! as StandardSchemaV1<P>, (params) => {
    type _ = [AssertTrue<IsExact<typeof params, P>>]
  })
  assert.spec(arrowTool).equals<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EnableToolEvent<"Tool"> | ToolCallEvent<"Tool", P, EnterEvent | ExitEvent<void>>
  }>()

  function* _0() {
    const detach = yield* arrowTool
    assert.spec(detach).equals<{
      LanguageModel: never
      EmbeddingModel: never
      Event: DisableToolEvent<"Tool">
    }>()
  }

  const genTool = Tool("Tool", "", null! as StandardSchemaV1<P>, function* (params) {
    type _ = [AssertTrue<IsExact<typeof params, P>>]
    return ""
  })

  assert.spec(genTool).equals<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EnableToolEvent<"Tool"> | ToolCallEvent<"Tool", P, EnterEvent | ExitEvent<string>>
  }>()

  function* parent() {
    yield* Tool("ParentTool", "", null! as StandardSchemaV1<P>, () => {})
    yield* Context("Context", function* () {
      yield* arrowTool
    })
  }

  assert.spec(parent).equals<{
    LanguageModel: never
    EmbeddingModel: never
    Event:
      | EnableToolEvent<"ParentTool">
      | ToolCallEvent<"ParentTool", P, EnterEvent | ExitEvent<void>>
      | ContextEvent<
          "Context",
          | EnterEvent
          | EnableToolEvent<"Tool">
          | ExitEvent<void>
          | ToolCallEvent<"Tool", P, EnterEvent | ExitEvent<void>>
        >
  }>()
})
