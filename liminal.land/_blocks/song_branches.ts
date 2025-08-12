import { Effect } from "effect"
import L from "liminal"

// ---cut---
Effect.gen(function*() {
  yield* L.user`Write a song about TypeScript in the genre of...`

  const variants = yield* Effect.all(
    ["Rap", "Rock", "Pop"].map((genre) =>
      L.branch(
        L.user(genre),
        L.assistant,
      )
    ),
    { concurrency: "unbounded" },
  )

  variants satisfies Array<string>
})
