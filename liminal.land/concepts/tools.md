# Liminal Tools

```ts
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
```
