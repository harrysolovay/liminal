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
      const a = yield* L.declareModel("secondary")
      yield* L.branch("fork-key", function*() {
        const b = yield* L.declareModel("child_a")
        const c = yield* L.declareModel("child_b")
        yield* b
        yield* c
      })
      const c = yield* L.declareModel("tertiary")
      yield* a
      yield* c
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
