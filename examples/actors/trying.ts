import { L } from "liminal"

export default function*() {
  yield* L.try("may-fail", function*() {
    if (Math.random() > .5) {
      throw new RandomError()
    }
    return 2
  }, function*(thrown) {
    if (thrown instanceof RandomError) {
      return 3
    }
    throw thrown
  })
}

class RandomError extends Error {
  override readonly name = "RandomError"
}
