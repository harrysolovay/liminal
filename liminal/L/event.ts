import type { EnsureNarrow } from "liminal-util"
import { type EventRune, RuneKey } from "../Rune.ts"

export function* event<E>(event: EnsureNarrow<E>): Generator<EventRune<E>, void> {
  yield {
    [RuneKey]: true,
    kind: "event",
    event: event,
  }
}
