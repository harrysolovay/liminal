import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
Effect.gen(function*() {
  yield* L.user`Write a song about TypeScript in the genre of...`

  const variants = yield* Effect.all(
    ["Rap", "Rock", "Pop"].map((genre) =>
      L.line(
        L.user(genre),
        L.assistant,
      ).pipe(
        L.make(
          L.thread,
        ),
      )
    ),
    { concurrency: "unbounded" },
  )

  variants satisfies Array<string>
})
