export interface Globals {
  handler<E = any>(event: E, info: EventInfo): void
}

export interface EventInfo {
  fiber: number
  timestamp: number
  // group
  // depth
}
