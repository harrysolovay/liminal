import { declare } from "../declare.js"
import type { Type } from "../Type.js"

export const integer: Type<number> = declare(() => integer)
