import { Model } from "./Model.js"
import { Context } from "../Context/Context.js"
import { describe, it, expect } from "bun:test"
import { TestEmbeddingModels } from "../testing/TestEmbeddingModels.js"
import { TestLanguageModels } from "../testing/TestLanguageModels.js"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const context = Context("Root", function* () {
      yield* Model("default")
      yield* Model("secondary")
      yield* Context("child", function* () {
        yield* Model("child_a")
        yield* Model("child_b", "embedding")
      })
      yield* Model("tertiary", "embedding")
    })
    const result = await context.exec({
      models: {
        language: TestLanguageModels(),
        embedding: TestEmbeddingModels(),
      },
    })
    expect(JSON.stringify(result, null, 2)).toMatchSnapshot()
  })
})
