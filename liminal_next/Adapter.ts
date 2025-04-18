import type { Message } from "./Message.ts"

export interface Adapter {
  resolve(messages: Array<Message>, schema?: object): Promise<string>
}
