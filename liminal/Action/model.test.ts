import { Model } from "./Model.js"
import { Context } from "./Context.js"
import { describe, it, expect } from "bun:test"
import { TestEmbeddingModels } from "../testing/TestEmbeddingModels.js"
import { TestLanguageModels } from "../testing/TestLanguageModels.js"
import type { ActionEvent } from "./ActionEvent.js"

describe("Model", () => {
  it("generates the expected event sequence", async () => {
    const events: Array<ActionEvent> = []
    await Context("Root", function* () {
      yield* Model("default")
      yield* Model("secondary")
      yield* Context("child", function* () {
        yield* Model("child_a")
        yield* Model("child_b", "embedding")
      })
      yield* Model("tertiary", "embedding")
    }).run({
      models: {
        language: TestLanguageModels(),
        embedding: TestEmbeddingModels(),
      },
      handler: (event) => events.push(event),
    })
    expect(events).toMatchSnapshot()
  })
})
