import alchemy from "alchemy"
import { CloudflareStateStore } from "alchemy/state"

const app = await alchemy("liminal", {
  stateStore: (scope) => new CloudflareStateStore(scope),
})

// TODO

await app.finalize()
