import { Tool, type EnableToolEvent, type ToolCallEvent } from "./Tool.js"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { IsExact, AssertTrue } from "conditional-type-checks"
import type { DisableToolEvent } from "./DisableTool.js"
import { SpecAssertionScope, type Spec } from "../Spec.js"
import type { EnterEvent, ExitEvent } from "./event_common.js"

SpecAssertionScope((assert) => {
  type P = {
    a: string
    b: string
  }

  const arrowTool = Tool("Tool", "", null! as StandardSchemaV1<P>, (params) => {
    type _ = [AssertTrue<IsExact<typeof params, P>>]
  })
  assert(arrowTool)<Spec<never, never, EnableToolEvent<"Tool"> | ToolCallEvent<"Tool", P, never>>>()

  function* _0() {
    const detach = yield* arrowTool
    assert(detach)<Spec<never, never, DisableToolEvent<"Tool">>>()
  }

  const genTool = Tool("Tool", "", null! as StandardSchemaV1<P>, function* (params) {
    type _ = [AssertTrue<IsExact<typeof params, P>>]
    return ""
  })

  assert(genTool)<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EnableToolEvent<"Tool"> | ToolCallEvent<"Tool", P, EnterEvent | ExitEvent<string>>
  }>()
})
