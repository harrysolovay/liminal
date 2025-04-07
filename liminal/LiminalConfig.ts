import type { ExecConfig } from "./Exec.ts"

export interface LiminalConfig extends ExecConfig {
  actors?: string
  silent?: boolean
  write?: boolean | string
}
