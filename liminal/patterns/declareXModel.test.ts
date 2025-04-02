import { describe, expect, it } from "bun:test"
import { context } from "../actions/Context.ts"
import type { ActionLike } from "../Actor/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { exec } from "../exec.ts"
import type { ExtractSpec } from "../Spec.ts"
import { TestEmbeddingModel } from "../testing/TestEmbeddingModel/TestEmbeddingModel.ts"
import { TestLanguageModel } from "../testing/TestLanguageModel/TestLanguageModel.ts"
import type { FromEntries } from "../util/FromEntries.ts"
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

function* y() {
  yield* declareLanguageModel("default")
  yield* declareLanguageModel("secondary")
  yield* context("child", function*() {
    yield* declareLanguageModel("child_a")
    yield* declareEmbeddingModel("child_b")
  })
  yield* declareEmbeddingModel("tertiary")
}
