declare namespace Cloudflare {
  interface Env {
    OPENAI_API_KEY: string
  }
}

interface Env extends Cloudflare.Env {}
