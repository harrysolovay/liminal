import type { L } from "./L.ts"

export interface Complete<I = any, O = any> {
  kind: "Complete"
  type: L<I, O>
}
