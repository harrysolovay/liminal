import { describe, expect, it } from "bun:test"
import { exec } from "../exec.ts"
import * as L from "../L.ts"
import { TestEmbeddingModel } from "../testing/TestEmbeddingModel.ts"
import { TestLanguageModel } from "../testing/TestLanguageModel.ts"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const scope = await exec(function*() {
      yield* L.declareLanguageModel("default")
      yield* L.declareLanguageModel("secondary")
      yield* L.fork("fork-key", function*() {
        yield* L.declareLanguageModel("child_a")
        yield* L.declareEmbeddingModel("child_b")
      })
      yield* L.declareEmbeddingModel("tertiary")
    }, {
      bind: {
        default: TestLanguageModel(),
        secondary: TestLanguageModel(),
        child_a: TestLanguageModel(),
        child_b: TestEmbeddingModel(),
        tertiary: TestEmbeddingModel(),
      },
    })
    expect(JSON.stringify(scope, null, 2)).toMatchSnapshot()
  })
})
