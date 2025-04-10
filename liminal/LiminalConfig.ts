import type { ExecConfig } from "./Exec.ts"

export interface LiminalConfig extends ExecConfig {
  agents?: string
  silent?: boolean
  write?: boolean | string
}
