import type { Action } from "../Action/mod.ts"
import type { ExecEvent, ExtractE } from "../mod.ts"

export declare function Exec<Y extends Action, R>(
  iter: Iterator<Y, R> | AsyncIterator<Y, R>,
): AsyncGenerator<ExecEvent<ExtractE<Y>>, Awaited<R>>
