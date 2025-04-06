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
  } catch (thrown: unknown) {
    if (thrown instanceof RandomError) {
      yield* L.emit("some-error")
      ;(yield* L.throw(thrown))()
      // TODO: Why isn't subsequent code identified as unreachable. TS compiler bug?
    }
    throw thrown
  }
}

class RandomError extends Error {
  override readonly name = "RandomError"
}
