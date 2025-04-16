import type { AppendMessage } from "../Rune/AppendMessage.ts"
import type { LBase } from "./_LBase.ts"

export interface system extends LBase<AppendMessage, void> {}

/** Append a user message to the agent's message list. */
export declare function system(template: TemplateStringsArray, ...substitutions: Array<string>): system
export declare function system(content: string): system
