import type { AppendMessage } from "../Rune/AppendMessage.ts"
import type { LBase } from "./_LBase.ts"

export interface user extends LBase<AppendMessage, void> {}

/** Append a user message to the agent's message list. */
export declare function user(template: TemplateStringsArray, ...substitutions: Array<string>): user
export declare function user(content: string): user
