import type { ExecConfig } from "./Exec1.ts"

export interface LiminalConfig extends ExecConfig {
  actors?: string
  silent?: boolean
  write?: boolean | string
}
