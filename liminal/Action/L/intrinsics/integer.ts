import { declare } from "../declare.ts"
import type { L } from "../L.ts"

export const integer: L<number> = declare(() => integer)
