import { describe, expect, it } from "bun:test"
import { Exec } from "../../Exec.ts"
import * as L from "../../L.ts"
import { TestEmbeddingModel } from "../../testing/TestEmbeddingModel.ts"
import { TestLanguageModel } from "../../testing/TestLanguageModel.ts"

describe.skip("Model", () => {
  it("generates the expected event sequence", async () => {
    const scope = await Exec(function*() {
      yield* L.declareLanguageModel("secondary")
      yield* L.fork("fork-key", function*() {
        yield* L.declareLanguageModel("child_a")
        yield* L.declareEmbeddingModel("child_b")
      })
      yield* L.declareEmbeddingModel("tertiary")
    }, {
      default: TestLanguageModel(),
      args: {
        secondary: TestLanguageModel(),
        child_a: TestLanguageModel(),
        child_b: TestEmbeddingModel(),
        tertiary: TestEmbeddingModel(),
      },
    })
    expect(JSON.stringify(scope, null, 2)).toMatchSnapshot()
  })
})
