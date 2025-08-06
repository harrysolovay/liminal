import { Console, Effect, flow } from "effect"
import { L, LPretty } from "liminal"

export const logger = L.handle(flow(
  LPretty.event,
  Console.log,
  Effect.andThen(Console.log()),
))
