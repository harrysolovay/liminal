import type { AppendMessage } from "../Rune/AppendMessage.ts"
import type { LBase } from "./_LBase.ts"

export interface assistant extends LBase<AppendMessage, void> {}

/** Append an assistant message to the agent's message list. */
export declare function assistant(template: TemplateStringsArray, ...substitutions: Array<string>): assistant
export declare function assistant(content: string): assistant
