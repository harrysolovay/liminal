import { describe, expect, it } from "bun:test"
import { Context } from "../Context/Context.js"
import { Exec } from "../Exec/Exec.js"
import { TestEmbeddingModel } from "../testing/TestEmbeddingModel.js"
import { TestLanguageModel } from "../testing/TestLanguageModel.js"
import { Model } from "./Model.js"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const scope = await Exec(function*() {
      yield* Model.language("default")
      yield* Model.language("secondary")
      yield* Context("child", function*() {
        yield* Model.language("child_a")
        yield* Model.embedding("child_b")
      })
      yield* Model.embedding("tertiary")
    })
      .models({
        default: TestLanguageModel(),
        secondary: TestLanguageModel(),
        child_a: TestLanguageModel(),
        child_b: TestEmbeddingModel(),
        tertiary: TestEmbeddingModel(),
      })
      .exec()
    expect(JSON.stringify(scope, null, 2)).toMatchSnapshot()
  })
})
