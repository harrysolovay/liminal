export interface LEventBase<K extends string> {
  fiber: number
  type: K
}
