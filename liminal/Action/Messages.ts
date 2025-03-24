// TODO: include system message?
export function* Messages(): Generator<Messages, Array<string>> {
  return yield {
    kind: "Messages",
  }
}

export interface Messages {
  kind: "Messages"
}
