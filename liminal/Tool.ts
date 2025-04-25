import {
  type LType,
  Schema,
  type SchemaObject,
  toJSONSchema,
  validate,
  type Value,
  type ValueObject,
} from "liminal-schema"

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
