import { expect, it } from "@effect/vitest"
import * as Effect from "effect/Effect"

function divide(a: number, b: number) {
  if (b === 0) return Effect.fail("Cannot divide by zero")
  return Effect.succeed(a / b)
}

it.effect(
  "test success",
  Effect.fn(function*() {
    const result = yield* divide(4, 2)
    expect(result).toBe(2)
  }),
)
