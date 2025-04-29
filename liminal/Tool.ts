import { type LType, toJSONSchema, validate } from "./schema/LType.ts"
import { Schema, type SchemaObject } from "./schema/Schema.ts"
import type { Value, ValueObject } from "./schema/Value.ts"

export class Tool {
  static async make<T extends ValueObject>(
    description: string,
    type: LType<T>,
    f: (arg: T) => Value | Promise<Value>,
  ) {
    const schema = toJSONSchema(type)
    return new Tool(
      await Schema.id(schema, description),
      description,
      schema,
      async (arg) => {
        return await f(await validate(type, arg) as never)
      },
    )
  }

  constructor(
    readonly name: string,
    readonly description: string,
    readonly parameterSchema: SchemaObject,
    readonly f: (arg: any) => Value | Promise<Value>,
  ) {}
}
