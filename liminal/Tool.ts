import { type LType, type SchemaObject, toJSONSchema, validate, type Value, type ValueObject } from "liminal-schema"
import { subtle } from "node:crypto"

export class Tool {
  static async make<T extends ValueObject>(
    description: string,
    type: LType<T>,
    f: (arg: T) => Value | Promise<Value>,
  ) {
    const encoder = new TextEncoder()
    const schema = toJSONSchema(type)
    const buffer = await subtle.digest("SHA-256", encoder.encode(description + "\n\n" + JSON.stringify(schema)))
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (const b of bytes) binary += String.fromCharCode(b)
    const base64 = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
    return new Tool(base64, description, schema, async (arg) => {
      return await f(await validate(type, arg) as never)
    })
  }

  constructor(
    readonly name: string,
    readonly description: string,
    readonly parameterSchema: SchemaObject,
    readonly f: (arg: any) => Value | Promise<Value>,
  ) {}
}
