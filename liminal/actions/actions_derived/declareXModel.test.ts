import { describe, expect, it } from "bun:test"
import type { LEvent } from "../../events/LEvent.ts"
import { Exec } from "../../Exec.ts"
import * as L from "../../L.ts"
import { TestEmbeddingModel } from "../../testing/TestEmbeddingModel.ts"
import { TestLanguageModel } from "../../testing/TestLanguageModel.ts"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const events: Array<LEvent> = []
    await Exec(function*() {
      yield* L.declareModel("secondary")
      yield* L.branch("fork-key", function*() {
        yield* L.declareModel("child_a")
        yield* L.declareModel("child_b")
      })
      yield* L.declareModel("tertiary")
    }, {
      default: TestLanguageModel(),
      args: {
        secondary: TestLanguageModel(),
        child_a: TestLanguageModel(),
        child_b: TestEmbeddingModel(),
        tertiary: TestEmbeddingModel(),
      },
    })((event) => events.push(event))
    expect(JSON.stringify(events, null, 2)).toMatchSnapshot()
  })
})
