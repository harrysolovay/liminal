# TestLanguageModel

```ts twoslash
import { describe, expect, it } from "bun:test"
import { DeclareModel, Exec } from "liminal"
import { TestLanguageModel } from "liminal/testing"

describe("Liminal Test", () => {
  it("scope snapshot matches", async () => {
    const scope = await Exec(function*() {
      yield* DeclareModel.language("default")
      // ...
    })
      .models({
        default: TestLanguageModel(),
      })
      .exec()

    expect(JSON.stringify(scope, null, 2)).toMatchSnapshot()
  })
})
```
