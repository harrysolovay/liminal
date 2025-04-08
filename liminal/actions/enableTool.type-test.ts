// import type { AssertTrue, IsExact } from "conditional-type-checks"
// import type { ChildEvent } from "../events/ChildEvent.ts"
// import type { EmittedEvent } from "../events/EmittedEvent.ts"
// import type { ToolCalledEvent } from "../events/ToolCalledEvent.ts"
// import type { ToolDisabledEvent } from "../events/ToolDisabledEvent.ts"
// import type { ToolEnabledEvent } from "../events/ToolEnabledEvent.ts"
// import * as L from "../L.ts"
// import { ActorAssertions } from "../testing/ActorAssertions.ts"
// import { emit } from "./emit.ts"
// import { enableTool } from "./enableTool.ts"

// type P = typeof P["T"]
// const P = L.object({
//   a: L.string,
//   b: L.string,
// })

// const arrowTool = L.enableTool("Tool", "", P, (params) => {
//   type _ = [AssertTrue<IsExact<typeof params, P>>]
// })

// ActorAssertions(arrowTool).assertSpec<{
//   Entry: never
//   Event: ToolEnabledEvent<"Tool"> | ChildEvent<"tool", "Tool", ToolCalledEvent<"Tool", P>, void>
//   Throw: never
//   Child: never
// }>()

// function* _0() {
//   const detach = yield* arrowTool
//   ActorAssertions(detach).assertSpec<{
//     Entry: never
//     Event: ToolDisabledEvent<"Tool">
//     Throw: never
//     Child: never
//   }>()
// }

// const genTool = enableTool("tool-key", "", P, function*(params) {
//   type _ = [AssertTrue<IsExact<typeof params, P>>]
//   yield* emit("Test", {})
//   return ""
// })

// ActorAssertions(genTool).assertSpec<{
//   Entry: never
//   Event:
//     | ToolEnabledEvent<"tool-key">
//     | ChildEvent<
//       "tool",
//       "tool-key",
//       | EmittedEvent<"Test", {}>
//       | ToolCalledEvent<"tool-key", {
//         a: string
//         b: string
//       }>,
//       string
//     >
//   Throw: never
//   Child: never
// }>()

// function* parent() {
//   yield* L.enableTool("parent-tool", "", P, () => {})
//   yield* L.branch("fork-key", {
//     *"arm-key"() {
//       yield* arrowTool
//     },
//   })
// }

// ActorAssertions(parent).assertSpec<{
//   Entry: never
//   Event:
//     | ToolEnabledEvent<"parent-tool">
//     | ChildEvent<
//       "tool",
//       "parent-tool",
//       ToolCalledEvent<"parent-tool", {
//         a: string
//         b: string
//       }>,
//       void
//     >
//     | ChildEvent<
//       "branch",
//       "fork-key",
//       ChildEvent<
//         "branch_arm",
//         "arm-key",
//         | ToolEnabledEvent<"Tool">
//         | ChildEvent<
//           "tool",
//           "Tool",
//           ToolCalledEvent<"Tool", {
//             a: string
//             b: string
//           }>,
//           void
//         >,
//         void
//       >,
//       { "arm-key": void }
//     >
//   Throw: never
//   Child: never
// }>()
