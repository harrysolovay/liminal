import type { ExecConfig } from "./exec.ts"

export interface LiminalConfig extends ExecConfig {
  actors?: string
  bind: Record<keyof any, any>
  print?: boolean
}
