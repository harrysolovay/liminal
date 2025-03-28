import type { ActionLike } from "./Action/Action.js"
import type { NarrowExecConfig } from "./ExecConfig.js"

export interface Rune<Y extends ActionLike, T> extends IteratorObject<Y, T> {
  run(config: NarrowExecConfig<Y>): Promise<T>
}
