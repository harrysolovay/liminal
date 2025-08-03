import { Console, Effect, flow, Stream } from "effect"
import { event, L } from "liminal"

export const logger = L.events.pipe(
  Stream.runForEach(
    flow(
      event,
      Console.log,
      Effect.andThen(Console.log()),
    ),
  ),
  Effect.fork,
)
