import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { AssertTrue, IsExact } from "conditional-type-checks"
import { Context } from "../Context/Context.js"
import type { ContextEvent } from "../Context/ContextEvent.js"
import { Emission } from "../Emission/Emission.js"
import type { EmissionEvent } from "../Emission/EmitEvent.js"
import { ActorAssertions } from "../testing/ActorAssertions.js"
import type { ToolRemovalEvent } from "../ToolRemoval/ToolRemovalEvent.js"
import { Tool } from "./Tool.js"
import type { ToolEvent } from "./ToolEvent.js"

type P = {
  a: string
  b: string
}

const arrowTool = Tool("Tool", "", null! as StandardSchemaV1<P>, (params) => {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
})
ActorAssertions(arrowTool).assertSpec<{
  LanguageModel: never
  EmbeddingModel: never
  Event: ToolEvent<"Tool", P, never, void>
}>()

function* _0() {
  const detach = yield* arrowTool
  ActorAssertions(detach).assertSpec<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolRemovalEvent<"Tool">
  }>()
}

const genTool = Tool("Tool", "", null! as StandardSchemaV1<P>, function*(params) {
  type _ = [AssertTrue<IsExact<typeof params, P>>]
  yield* Emission("Test", {})
  return ""
})

ActorAssertions(genTool).assertSpec<{
  LanguageModel: never
  EmbeddingModel: never
  Event: ToolEvent<"Tool", P, EmissionEvent<"Test", {}>, string>
}>()

function* parent() {
  yield* Tool("ParentTool", "", null! as StandardSchemaV1<P>, () => {})
  yield* Context("Context", function*() {
    yield* arrowTool
  })
}

ActorAssertions(parent).assertSpec<{
  LanguageModel: never
  EmbeddingModel: never
  Event: ToolEvent<"ParentTool", P, never, void> | ContextEvent<"Context", ToolEvent<"Tool", P, never, void>, void>
}>()
