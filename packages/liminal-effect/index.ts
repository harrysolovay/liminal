import { Schema } from "effect"
import { make } from "effect/Schema"
import { Schema as LiminalSchema } from "liminal"

export function compile<T>(type: Schema.Schema<T>): LiminalSchema<T> {
  return LiminalSchema.compile(type, {
    schema() {
      return make(type.ast)
    },
    async validate(value) {
      return Schema.decodeSync(type as never)(value)
    },
  })
}
