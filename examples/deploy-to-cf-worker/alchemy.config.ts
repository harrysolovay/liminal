import alchemy from "alchemy"
import { Worker } from "alchemy/cloudflare"
import { resolve } from "node:path"
import { argv } from "node:process"
import { fileURLToPath } from "node:url"
import { env } from "../../env.ts"

await using _ = alchemy("liminal:liminal-example-deploy-to-cf-worker", {
  stage: env.STAGE,
  phase: argv.includes("--destroy") ? "destroy" : "up",
})

export const worker = await Worker("liminal-exec-worker", {
  name: "liminal-exec",
  url: true,
  entrypoint: fileURLToPath(import.meta.resolve("./worker/worker.ts")),
  env: {
    OPENAI_API_KEY: env.OPENAI_API_KEY,
  },
  bundle: {
    external: ["@valibot/to-json-schema"],
  },
})
