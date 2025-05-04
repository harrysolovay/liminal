import { openai } from "@ai-sdk/openai"
import { L } from "liminal"
import { adapter } from "liminal-ai"

const FileInfo = L.object({
  changeType: L.enum("create", "modify", "delete"),
  filePath: L.string,
  purpose: L.string,
})

function* implement(file: typeof FileInfo.T) {
  yield* L.system(IMPLEMENTATION_PROMPTS[file.changeType])
  yield* L.user`Implement the changes for ${file.filePath} to support: ${file.purpose}`
  const implementation = yield* L.assistant(L.object({
    explanation: L.string,
    code: L.string,
  }))
  return { file, implementation }
}

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}

await L.run(function*() {
  yield* L.focus(adapter(openai("gpt-4o-mini", {
    structuredOutputs: true,
  })))
  yield* L.system`You are a senior software architect planning feature implementations.`
  yield* L.user`Analyze this feature request and create an implementation plan:`
  yield* L.user`Alert administrators via text whenever site traffic exceeds a certain threshold.`
  const implementationPlan = yield* L.assistant(L.object({
    complexity: L.enum("low", "medium", "high"),
    files: L.array(FileInfo),
  }))
  const fileChanges = yield* L.all(implementationPlan.files.map(implement))
  return { fileChanges, implementationPlan }
}, { handler: console.log })
