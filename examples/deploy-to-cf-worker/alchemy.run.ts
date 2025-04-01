import alchemy from "alchemy"
import { Worker } from "alchemy/cloudflare"
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
  bindings: {
    OPENAI_API_KEY: alchemy.secret(env.OPENAI_API_KEY),
  },
  bundle: {
    external: ["@valibot/to-json-schema"],
  },
})
