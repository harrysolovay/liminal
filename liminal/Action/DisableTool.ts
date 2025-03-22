export interface DisableTool<K extends keyof any = keyof any> {
  kind: "DisableTool"
  key: K
}
