# Liminal Messages <Badge type="warning" text="beta" />

## Effect AI `Message` Format

## `L.user`

## `L.userJson`

## `L.assistant`

## `L.assistantStruct`

Use Effect Schema to describe structured output requirements.

### Directly Providing Fields

```ts {4-7} twoslash
import { Effect, Schema } from "effect"
import { L } from "liminal"
// ---cut---
Effect.gen(function*() {
  yield* L.user`When is halloween?`

  const result = yield* L.assistantStruct({
    month: Schema.Int,
    day: Schema.Int,
  })

  result satisfies { month: number; day: number }
})
```

### Providing a Struct Schema

```ts {1-4,9} twoslash
import { Effect, Schema } from "effect"
import { L } from "liminal"
// ---cut---
const MonthDay = Schema.Struct({
  month: Schema.Int,
  day: Schema.Int,
})

Effect.gen(function*() {
  yield* L.user`When is halloween?`

  const result = yield* L.assistantStruct(MonthDay)

  result satisfies { month: number; day: number }
})
```

## `L.messages`

## `L.append`

## `L.clear`
