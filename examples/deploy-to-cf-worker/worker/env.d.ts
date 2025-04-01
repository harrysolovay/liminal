import type { worker } from "../alchemy.run"

export type CloudflareEnv = typeof worker.Env

declare module "cloudflare:workers" {
  export namespace Cloudflare {
    export interface Env extends CloudflareEnv {}
  }
}
