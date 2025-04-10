export interface CliCtx {
  ctl: AbortController
  error(message: string): never
}
