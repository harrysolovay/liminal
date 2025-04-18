import type { JSONSchema, OpenAPIObject, PathItemObject } from "liminal-shapes"
import { assert } from "liminal-util"
import { mkdir, rmdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import yaml from "yaml"

const TARGETS: Record<string, string> = {
  xai: "https://docs.x.ai/openapi.json",
  openai: "https://raw.githubusercontent.com/openai/openai-openapi/refs/heads/master/openapi.yaml",
}

const typesDir = resolve(import.meta.dirname, "types")
try {
  await rmdir(typesDir, { recursive: true })
} catch (_e: unknown) {}
await mkdir(typesDir, { recursive: true })

class Typegen {
  static async generate(provider: string, specUrl: string) {
    const specTxt = await fetch(specUrl).then((response) => response.text())
    const spec: OpenAPIObject = specUrl.endsWith(".yaml") ? yaml.parse(specTxt) : JSON.parse(specTxt)
    const ctx = new this(provider, spec)
    await mkdir(ctx.providerDir)
    await writeFile(resolve(ctx.providerDir, "index.ts"), `export type Endpoints = ${ctx.code}`, "utf-8")
  }

  provider: string
  providerDir: string
  referenced: Set<string> = new Set()
  spec: OpenAPIObject
  paths: Record<string, PathItemObject>
  code: string
  constructor(provider: string, spec: OpenAPIObject) {
    this.provider = provider
    this.providerDir = resolve(typesDir, provider)
    this.spec = spec
    const { paths } = spec
    assert(paths)
    this.paths = paths
    let code = "{\n"
    for (const [path, pathObject] of Object.entries(this.paths)) {
      code += this.endpointField(path, pathObject)
    }
    code += "\n}"
    this.code = code
  }

  endpointField(path: string, pathObject: PathItemObject) {
    const { get, post, summary } = pathObject
    let methods = ""
    if (summary) {
      methods += `// ${summary}\n`
    }
    methods += `"${path}": {\n`
    if (get) {
      // methods += prefixSummary(get, `get: {\n`)
      const { responses, parameters, security } = get
      if (get.parameters) {
        const result = Object.groupBy(get.parameters, (parameter) => parameter.in)
        // methods += `parameters: {\n`
        // for (const parameter of get.parameters) {}
        // methods += `\n  },`
      }
      // methods += `\n},`
    } else if (post) {
      // methods += prefixSummary(post, `post: {`)
      // methods += `\n},`
    }
    methods += "\n},"
    return methods
  }
}

const pending: Promise<void>[] = []
for (const [provider, specUrl] of Object.entries(TARGETS)) {
  pending.push(Typegen.generate(provider, specUrl))
}
await Promise.all(pending)

function prefixSummary({ summary }: { summary?: string }, methodField: string) {
  if (summary) {
    return `// ${summary}\n${methodField}`
  }
  return methodField
}
