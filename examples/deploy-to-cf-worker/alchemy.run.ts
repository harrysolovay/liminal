import alchemy from "alchemy"
import { Worker } from "alchemy/cloudflare"
import { env } from "liminal-common"
// @ts-ignore
import { argv } from "node:process"
// @ts-ignore
import { fileURLToPath } from "node:url"

await using _ = alchemy("liminal:liminal-example-deploy-to-cf-worker", {
  stage: env.STAGE,
  phase: argv.includes("--destroy") ? "destroy" : "up",
  password: (globalThis as never as {
    prompt: (message: string) => string
  }).prompt("Enter secret encryption password:")!,
})

export const worker = await Worker("liminal-exec-worker", {
  name: "liminal-exec",
  url: true,
  // @ts-ignore
  entrypoint: fileURLToPath(import.meta.resolve("./worker/worker.ts")),
  bindings: {
    OPENAI_API_KEY: alchemy.secret(env.OPENAI_API_KEY),
  },
  bundle: {
    external: ["@valibot/to-json-schema"],
  },
})
