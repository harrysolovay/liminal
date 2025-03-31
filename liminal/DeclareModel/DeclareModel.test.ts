import { describe, expect, it } from "bun:test"
import { Context } from "../Context/Context.ts"
import { Exec } from "../Exec/Exec.ts"
import { TestEmbeddingModel } from "../testing/TestEmbeddingModel.ts"
import { TestLanguageModel } from "../testing/TestLanguageModel.ts"
import { DeclareModel } from "./DeclareModel.ts"

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
