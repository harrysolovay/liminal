import type { Message } from "./Message.ts"
import { ModelRegistry } from "./ModelRegistry.ts"
import type { Rune } from "./Rune.ts"
import type { Strand } from "./Strand.ts"
import type { Tool } from "./Tool.ts"

export interface Config<Y extends Rune<any> = Rune<any>, T = any> {
  handler?: ((this: Strand<Y, T>, event: Rune.E<Y>) => void) | undefined
  models?: ModelRegistry | undefined
  messages?: Array<Message>
  tools?: Set<Tool> | undefined
  signal?: AbortSignal | undefined
}
