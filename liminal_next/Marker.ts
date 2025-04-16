import type { Segment } from "./Segment.ts"

export interface Marker {
  to(marker: Marker): Segment
}
