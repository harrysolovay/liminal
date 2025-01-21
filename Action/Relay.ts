import type { Message } from "./Message.ts"

export interface Relay {
  kind: "Relay"
  f: (message: Message) => unknown
}

export function* relay(f: (message: Message) => unknown): Generator<Relay, () => void> {
  return yield {
    kind: "Relay",
    f,
  }
}
