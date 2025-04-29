import { L } from "liminal"

await L.run(function*() {
  const result = yield* L.catch(function*() {
    return mayThrow()
  })
  if (result.resolved) {
    console.log("Succeed with the following value:", result.resolved)
  } else {
    console.log("Threw the following value:", result.rejected)
  }
})

function mayThrow(): number {
  const rand = Math.random()
  if (rand > .5) {
    throw new Error()
  }
  return rand
}
