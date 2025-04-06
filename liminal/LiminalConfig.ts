import type { ExecConfig } from "./exec.ts"

export interface LiminalConfig extends ExecConfig {
  actors?: string
  print?: boolean
  write?: boolean | string
}
