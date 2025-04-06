import { L } from "liminal"

export default function*() {
  const result = yield* L.try("attempt", mayThrow)
  if (result.thrown) {
    console.log("Threw the following value:", result.thrown)
  } else {
    console.log("Succeed with the following value:", result.value)
  }
}

function* mayThrow() {
  try {
    const rand = Math.random()
    if (rand > .5) {
      throw new RandomError()
    }
    return rand
  } catch (e: unknown) {
    if (e instanceof RandomError) {
      yield* L.emit("some-error")
      ;(yield* L.throw(e))()
      // TODO: Why isn't subsequent code identified as unreachable. TS compiler bug?
    }
    throw e
  }
}

class RandomError extends Error {
  override readonly name = "RandomError"
}
