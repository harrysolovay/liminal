import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { L } from "liminal"
import { adapter } from "liminal-ai"
import "liminal-arktype/register"

const FileInfo = type({
  changeType: "'create' | 'modify' | 'delete'",
  filePath: "string",
  purpose: "string",
})

function* implement(file: typeof FileInfo.infer) {
  yield* L.system(IMPLEMENTATION_PROMPTS[file.changeType])
  yield* L.user`Implement the changes for ${file.filePath} to support: ${file.purpose}`
  const implementation = yield* L.assistant(type({
    explanation: "string",
    code: "string",
  }))
  return { file, implementation }
}

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}

await L.run(function*() {
  yield* L.model(adapter(openai("gpt-4o-mini", {
    structuredOutputs: true,
  })))
  yield* L.system`You are a senior software architect planning feature implementations.`
  yield* L.user`Analyze this feature request and create an implementation plan:`
  yield* L.user`Alert administrators via text whenever site traffic exceeds a certain threshold.`
  const implementationPlan = yield* L.assistant(type({
    complexity: "'low' | 'medium' | 'high'",
    files: FileInfo.array(),
  }))
  const fileChanges = yield* L.branch.all(implementationPlan.files.map(implement))
  return { fileChanges, implementationPlan }
}, { handler: console.log })
