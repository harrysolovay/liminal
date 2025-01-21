import type { F } from "../Action/F.ts"
import type { Action } from "../Action/mod.ts"
import type { ExecEvent, ExtractE } from "../mod.ts"

export declare function Exec<Y extends Action, R>(
  f: F<Y, R>,
): AsyncGenerator<ExecEvent<ExtractE<Y>>, Awaited<R>>
