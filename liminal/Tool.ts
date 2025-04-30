import { Schema } from "./Schema.ts"
import type { JSONValue } from "./util/JSONValue.ts"

export class Tool {
  static async make<T extends JSONValue>(
    description: string,
    schema: Schema<T>,
    f: (arg: T) => JSONValue | Promise<JSONValue>,
  ) {
    return new Tool(
      await Schema.id(schema, description),
      description,
      schema,
      async (arg) => {
        return await f(await Schema.validateValue(schema, arg))
      },
    )
  }

  constructor(
    readonly name: string,
    readonly description: string,
    readonly parameterSchema: Schema,
    readonly f: (arg: any) => JSONValue | Promise<JSONValue>,
  ) {}
}
