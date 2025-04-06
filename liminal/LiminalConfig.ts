import type { ExecConfig } from "./exec.ts"

export interface LiminalConfig extends ExecConfig {
  actors?: string
  silent?: boolean
  write?: boolean | string
}
