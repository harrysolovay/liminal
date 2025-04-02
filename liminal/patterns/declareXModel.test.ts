import { describe, expect, it } from "bun:test"
import { context } from "../Context/Context.ts"
import { exec } from "../exec.ts"
import { TestEmbeddingModel } from "../testing/TestEmbeddingModel/TestEmbeddingModel.ts"
import { TestLanguageModel } from "../testing/TestLanguageModel/TestLanguageModel.ts"
import { declareEmbeddingModel } from "./declareEmbeddingModel.ts"
import { declareLanguageModel } from "./declareLanguageModel.ts"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const scope = await exec(function*() {
      yield* declareLanguageModel("default")
      yield* declareLanguageModel("secondary")
      yield* context("child", function*() {
        yield* declareLanguageModel("child_a")
        yield* declareEmbeddingModel("child_b")
      })
      yield* declareEmbeddingModel("tertiary")
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
