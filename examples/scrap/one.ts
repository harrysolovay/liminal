// import { type } from "arktype"
// import { L, type Rune } from "liminal"

// export function* brainstormComplex(seed: string): Generator<Rune<any>, any> {
//   // Level 1: Generate high-level alternatives
//   const alternatives = yield* L.record(function*() {
//     yield* L.system`Generate several high-level alternative approaches for the following idea.`
//     yield* L.user`Idea:\n\n${seed}`
//     let { alternatives } = yield* L.assistant(type({ alternatives: "string[]" }))
//     return alternatives
//   })

//   // Level 2: For each alternative, expand into sub-ideas
//   const expanded = yield* L.record(alternatives.map(function*(alt) {
//     yield* L.system`Expand this alternative into several detailed sub-ideas.`
//     yield* L.user`Alternative:\n\n${alt}`
//     let { subIdeas } = yield* L.assistant(type({ subIdeas: "string[]" }))
//     return { alt, subIdeas }
//   }))

//   // Level 3: For each sub-idea, explore challenges and solutions
//   const withChallenges = yield* L.record(expanded.flatMap(({ alt, subIdeas }) =>
//     subIdeas.map(function*(sub) {
//       yield* L.system`For the following sub-idea, list possible challenges and propose solutions.`
//       yield* L.user`Sub-idea:\n\n${sub}`
//       let { challenges, solutions } = yield* L.assistant(type({
//         challenges: "string[]",
//         solutions: "string[]",
//       }))
//       return { alt, sub, challenges, solutions }
//     })
//   ))

//   // Level 4: (Optional) User selects a branch to elaborate further
//   const selected = yield* L.record(function*() {
//     yield* L.system`Here are the explored branches. Select one to elaborate further, or type \"none\" to finish.`
//     yield* L.user`Branches:\n\n${JSON.stringify(withChallenges, null, 2)}`
//     let { selection } = yield* L.assistant(type({ selection: "number | 'none'" }))
//     return selection
//   })

//   if (selected !== "none") {
//     const branch = withChallenges[selected]
//     // Level 5: Further elaborate on the selected branch
//     return yield* L.record(function*() {
//       yield* L.system`Elaborate in detail on the following branch, providing actionable steps and potential outcomes.`
//       yield* L.user`Branch:\n\n${JSON.stringify(branch, null, 2)}`
//       return yield* L.assistant
//     })
//   }

//   return withChallenges
// }
