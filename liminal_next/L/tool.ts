import type { EnableTool } from "../Rune/EnableTool.ts"
import type { LBase } from "./_LBase.ts"

export interface tool extends LBase<EnableTool, void> {}

export declare function tool(): tool
