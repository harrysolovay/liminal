# TestLanguageModel

```ts twoslash
import { describe, expect, it } from "bun:test"
import { Conversation, Model } from "liminal"
import { TestLanguageModel } from "liminal/testing"

describe("Liminal Test", () => {
  it("scope snapshot matches", async () => {
    const scope = await Conversation(function*() {
      yield* Model.language("default")
      // ...
    })
      .models({
        default: TestLanguageModel(),
      })
      .reduce()

    expect(JSON.stringify(scope, null, 2)).toMatchSnapshot()
  })
})
```
