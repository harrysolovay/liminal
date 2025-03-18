import type { Type } from "../Type.js"
import { declare } from "../declare.js"

// `union` instead?
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declare(enum_<V>, values.toSorted())
}
Object.defineProperty(enum_, "name", { value: "enum" })
export { enum_ as enum }
