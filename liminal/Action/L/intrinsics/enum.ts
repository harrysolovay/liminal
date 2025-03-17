import type { L } from "../L.js"
import { declare } from "../declare.js"

// `union` instead?
function enum_<V extends Array<string>>(...values: V): L<V[number]> {
  return declare(enum_<V>, values.toSorted())
}
Object.defineProperty(enum_, "name", { value: "enum" })
export { enum_ as enum }
