// import { type } from "arktype"
// import "liminal-arktype/register"
// import { L, type Rune } from "liminal"
// import { gpt4o } from "./_models.ts"

// interface WorldElement {
//   name: string
//   description: string
//   connections: Array<{
//     to: string
//     relationship: string
//   }>
// }

// interface StoryBeat {
//   location: string
//   event: string
//   consequences: string[]
// }

// const worldElementValidator = type({
//   elements: "object[]",
// })

// const storyBeatValidator = type({
//   beats: "object[]",
// })

// export function* storyWorld(initialSeed?: string): Generator<Rune, any> {
//   yield* L.focus(gpt4o)
//   yield* L.user`The world-building begins.`

//   // Get the initial world seed from user if not provided
//   const seed = initialSeed ?? (yield* L.assistant)

//   // Level 1: Generate the core world elements
//   console.log("\n🌍 Generating core world elements...")
//   const worldElements = yield* L.record(function*() {
//     yield* L
//       .system`Create 3-5 interconnected core elements (characters, locations, or concepts) for a story world based on this seed. Each should have meaningful connections to others.`
//     yield* L.user`Seed: ${seed}`
//     const response = yield* L.assistant(worldElementValidator)
//     return response.elements as WorldElement[]
//   })

//   console.log("📍 Core elements generated:", worldElements?.map((e) => e.name).join(", "))

//   // Level 2: Recursive world expansion
//   function* expandElement(element: WorldElement, depth: number): Generator<Rune, WorldElement[]> {
//     if (depth > 3) return [] // Limit recursion depth

//     console.log(`\n🔍 Expanding element: ${element.name}`)
//     const subElements = yield* L.record(function*() {
//       yield* L.system`Expand this world element by creating 2-3 related sub-elements that add depth and complexity.`
//       yield* L.user`Element to expand:\n${JSON.stringify(element, null, 2)}`
//       const response = yield* L.assistant(worldElementValidator)
//       return response.elements as WorldElement[]
//     })

//     // Occasionally ask for user input on a particularly interesting sub-element
//     if (depth === 1 && subElements?.length > 0) {
//       yield* L.system`Choose a number between 1 and ${subElements.length} to explore further:`
//       const choiceInput = yield* L.assistant
//       const choice = parseInt(choiceInput) - 1
//       const chosen = subElements[choice]
//       if (chosen) {
//         const deeperElements = yield* expandElement(chosen, depth + 1)
//         return [...subElements, ...deeperElements]
//       }
//     }

//     // Recursively expand a random sub-element
//     const randomElement = subElements?.[Math.floor(Math.random() * (subElements?.length || 0))]
//     if (randomElement) {
//       const deeperElements = yield* expandElement(randomElement, depth + 1)
//       return [...(subElements || []), ...deeperElements]
//     }

//     return subElements || []
//   }

//   // Expand each core element
//   const expandedWorld: WorldElement[] = []
//   if (worldElements) {
//     for (const element of worldElements) {
//       const expanded = yield* expandElement(element, 1)
//       expandedWorld.push(...expanded)
//     }
//   }

//   // Level 3: Generate story beats
//   console.log("\n📖 Generating potential story beats...")
//   const storyBeats = yield* L.record(function*() {
//     yield* L
//       .system`Create 3-4 potential story beats that could occur in this world, incorporating various elements we've developed.`
//     yield* L.user`World elements:\n${JSON.stringify([...(worldElements || []), ...expandedWorld], null, 2)}`
//     const response = yield* L.assistant(storyBeatValidator)
//     return response.beats as StoryBeat[]
//   })

//   // Final user choice for story direction
//   console.log("\n🎯 Story beats generated:")
//   storyBeats?.forEach((beat, i) => {
//     console.log(`\n${i + 1}. Location: ${beat.location}`)
//     console.log(`   Event: ${beat.event}`)
//   })

//   yield* L.system`Choose a number between 1 and ${storyBeats?.length || 0} to select a story beat:`
//   const finalChoiceInput = yield* L.assistant
//   const finalChoice = parseInt(finalChoiceInput) - 1
//   const chosenBeat = storyBeats?.[finalChoice]

//   // Generate final story outline
//   console.log("\n✨ Generating final story outline...")
//   return yield* L.record(function*() {
//     yield* L
//       .system`Create a detailed story outline based on the chosen story beat, incorporating relevant world elements and suggesting possible narrative branches.`
//     yield* L.user`Chosen beat:\n${JSON.stringify(chosenBeat, null, 2)}\nWorld context:\n${
//       JSON.stringify(
//         {
//           coreElements: worldElements,
//           expandedElements: expandedWorld,
//         },
//         null,
//         2,
//       )
//     }`
//     return yield* L.assistant
//   })
// }

// // Example usage
// if (import.meta.main) {
//   await L.record(
//     function*() {
//       yield* L.focus(gpt4o)
//       return yield* storyWorld()
//     },
//     {
//       async handler(event) {
//         if (event.type === "fiber_status_changed" && event.status.type === "resolved") {
//           console.log("\n📚 Final Story Outline:")
//           console.log(event.status.value)
//         }
//       },
//     },
//   )
// }
