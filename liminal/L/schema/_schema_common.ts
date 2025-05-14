import type { Schema } from "../../Schema.ts"
import { fixTemplateStrings } from "../../util/fixTemplateStrings.ts"
import { isTemplateStringsArray } from "../../util/isTemplateStringsArray.ts"

export function make<S extends Schema>(schema: Omit<S, "T">, description?: string): S & TypeBase {
  const schema_ = {
    ...schema,
    ...description && { description },
  }

  const Type = Object.assign(function describe(e0?: TemplateStringsArray | string, ...rest: Array<string>) {
    const junction = isTemplateStringsArray(e0) ? String.raw(fixTemplateStrings(e0), ...rest) : e0
    return make(
      schema_,
      description ? `${description}${junction ? `\n\n${junction}` : ""}` : junction,
    )
  }, schema_)
  Object.defineProperty(Type, "toJSON", {
    value() {
      return schema_
    },
    enumerable: false,
  })
  return Type as never
}

export interface TypeBase {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<string>): this
}
