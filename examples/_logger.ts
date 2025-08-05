import { Console, Effect, flow, Stream } from "effect"
import { L, LPretty } from "liminal"

export const logger = L.events.pipe(
  Stream.runForEach(
    flow(
      LPretty.event,
      Console.log,
      Effect.andThen(Console.log()),
    ),
  ),
  Effect.fork,
)
