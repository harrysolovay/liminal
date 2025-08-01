import { Console, Effect, flow, Stream } from "effect"
import { L, pretty } from "liminal"

export const logger = L.events.pipe(
  Stream.runForEach(
    flow(
      pretty,
      Console.log,
      Effect.andThen(Console.log()),
    ),
  ),
  Effect.fork,
)
