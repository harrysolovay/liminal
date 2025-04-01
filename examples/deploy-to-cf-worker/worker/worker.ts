import type { ExportedHandler } from "@cloudflare/workers-types"
import { Exec } from "liminal"
import { Refine } from "./conversation.ts"

export default {
  async fetch(request) {
    const input = await request.text()
    try {
      const exec = Exec(Refine(input))
      const { result } = await exec.exec()
      return new Response(result)
    } catch (e: unknown) {
      console.error(e)
      return new Response("INTERNAL SERVER ERROR", {
        status: 500,
      })
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
