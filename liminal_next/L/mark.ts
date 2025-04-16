import type { Marker } from "../Marker.ts"
import type { Mark } from "../Rune/Mark.ts"
import type { LBase } from "./_LBase.ts"

export interface mark extends LBase<Mark, Marker> {}

export declare function mark(): mark
