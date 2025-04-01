import { type } from "arktype"
import { _util } from "liminal"
import { worker } from "./alchemy.config.ts"

const INPUT = _util.dedent`
  I'm testing usage of Alchemy to deploy a Liminal-executing function to CloudFlare.
  My sense is that this workflow is going to be incredibly smooth.
  Alchemy and Liminal are both shaping up quite well!
`

console.log(_util.dedent`
  Cloudflare worker URL: ${worker.url}.
  Liminal conversation input:

    \`\`\`
    ${INPUT}
    \`\`\`
`)

const url = new URL(type.string.assert(worker.url))
const refined = await fetch(url, {
  method: "POST",
  body: INPUT,
}).then((v) => v.text())
console.log(`Refined: "${refined}"`)
