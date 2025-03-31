import { describe, expect, it } from "bun:test"
import { Context } from "../Context/Context.js"
import { Exec } from "../Exec/Exec.js"
import { TestEmbeddingModel } from "../testing/TestEmbeddingModel.js"
import { TestLanguageModel } from "../testing/TestLanguageModel.js"
import { DeclareModel } from "./DeclareModel.js"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const scope = await Exec(function*() {
      yield* DeclareModel.language("default")
      yield* DeclareModel.language("secondary")
      yield* Context("child", function*() {
        yield* DeclareModel.language("child_a")
        yield* DeclareModel.embedding("child_b")
      })
      yield* DeclareModel.embedding("tertiary")
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
