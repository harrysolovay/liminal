# Liminal Tools <Badge type="warning" text="beta" />

## Make Tool

```ts
const mathTool = await Tool.make(
  "A tool for evaluating mathematical expressions.",
  L.array(L.string),
  mathjs.evaluate,
)
```

## Use Tool

```ts
import { type } from "arktype"
import "liminal-arktype/register"
import { L, Tool, ToolRegistry } from "liminal"
import * as mathjs from "mathjs"
import { gpt4oMini } from "./models.ts"

const tools = new ToolRegistry([mathTool])

const answer = await L.strand(
  function*() {
    yield* L.model(gpt4oMini)
    yield* L.user`
      A taxi driver earns $9461 per 1-hour of work. If he works 12 hours a day and in 1 hour
      he uses 12 liters of petrol with a price  of $134 for 1 liter. How much money does he earn in one day?
    `
    return yield* L.assistant
  },
  {
    handler: console.log,
    tools,
  },
)

console.log(answer)
```

<!-- ```ts
import { L } from "liminal"

function* g() {
  yield* L.tool`
    A tool for evaluating mathematical expressions.

    Example expressions:

    - 1.2 * (2 + 4.5)
    - 12.7 cm to inch
    - sin(45 deg) ^ 2
  `(L.array(L.string), mathjs.evaluate)

  yield* L.message`
    A taxi driver earns $9461 per 1-hour of work. If he works 12 hours a day and in 1 hour
    he uses 12 liters of petrol with a price  of $134 for 1 liter. How much money does he earn in one day?
  `

  return yield* L.number
}
``` -->
