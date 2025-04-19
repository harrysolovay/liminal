export interface Emitted<K extends keyof any = keyof any, V = any> {
  type: "emitted"
  key: K
  value: V
}
