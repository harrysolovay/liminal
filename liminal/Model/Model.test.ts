import { describe, expect, it } from "bun:test"
import { Context } from "../Context/Context.js"
import { Conversation } from "../Conversation/Conversation.js"
import { TestEmbeddingModel } from "../testing/TestEmbeddingModel.js"
import { TestLanguageModel } from "../testing/TestLanguageModel.js"
import { Model } from "./Model.js"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const scope = await Conversation(function*() {
      yield* Model("default")
      yield* Model("secondary")
      yield* Context("child", function*() {
        yield* Model("child_a")
        yield* Model("child_b", "embedding")
      })
      yield* Model("tertiary", "embedding")
    })
      .models({
        default: TestLanguageModel(),
        secondary: TestLanguageModel(),
        child_a: TestLanguageModel(),
        child_b: TestEmbeddingModel(),
        tertiary: TestEmbeddingModel(),
      })
      .reduce()
    expect(JSON.stringify(scope, null, 2)).toMatchSnapshot()
  })
})
