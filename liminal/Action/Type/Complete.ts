import type { Type } from "./Type.js"

export interface Complete<I = any, O = any> {
  kind: "Complete"
  type: Type<I, O>
}
