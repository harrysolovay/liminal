import { Tool, type ToolEvent } from "./Tool.js"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { IsExact, AssertTrue } from "conditional-type-checks"
import type { ToolRemovalEvent } from "./DisableTool.js"
import { AssertionScope } from "../testing/index.js"
import { Context, type ContextEvent } from "./Context.js"
import { Emit, type EmitEvent } from "./Emit.js"

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
    Event: ToolEvent<"Tool", P, never, void>
  }>()

  function* _0() {
    const detach = yield* arrowTool
    assert.spec(detach).equals<{
      LanguageModel: never
      EmbeddingModel: never
      Event: ToolRemovalEvent<"Tool">
    }>()
  }

  const genTool = Tool("Tool", "", null! as StandardSchemaV1<P>, function* (params) {
    type _ = [AssertTrue<IsExact<typeof params, P>>]
    yield* Emit("Test", {})
    return ""
  })

  assert.spec(genTool).equals<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolEvent<"Tool", P, EmitEvent<"Test", {}>, string>
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
    Event: ToolEvent<"ParentTool", P, never, void> | ContextEvent<"Context", ToolEvent<"Tool", P, never, void>, void>
  }>()
})
