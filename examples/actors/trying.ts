import { L } from "liminal"

export default function*() {
  const result = yield* L.try("attempt", mayThrowG)
  if (result.thrown) {
    console.log("Threw the following value:", result.thrown)
  } else {
    console.log("Succeed with the following value:", result.value)
  }
}

function* mayThrowG() {
  try {
    return mayThrow()
  } catch (e: unknown) {
    if (e instanceof RandomError) {
      yield* L.emit("some-error")
      ;(yield* L.throw(e))()
      // TODO: Why isn't subsequent code identified as unreachable. TS compiler bug?
    }
    throw e
  }
}

function mayThrow() {
  const rand = Math.random()
  if (rand > .5) {
    throw new RandomError()
  }
  return rand
}

class RandomError extends Error {
  override readonly name = "RandomError"
}
