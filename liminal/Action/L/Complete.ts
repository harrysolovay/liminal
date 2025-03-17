import type { L } from "./L.js"

export interface Complete<I = any, O = any> {
  kind: "Complete"
  type: L<I, O>
}
