import { openai } from "@ai-sdk/openai"
import { exec, L } from "liminal"
import { AILanguageModel } from "liminal-ai"

exec(plan("Alert administrators via text whenever site traffic exceeds a certain threshold."), {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini", {
      structuredOutputs: true,
    })),
  },
  handler: console.log,
})

function* plan(feat: string) {
  yield* L.declareLanguageModel("default")
  yield* L.system`You are a senior software architect planning feature implementations.`
  yield* L.user`Analyze this feature request and create an implementation plan:`
  yield* L.user(feat)
  const implementationPlan = yield* L.object({
    files: L.array(FileInfo),
    estimatedComplexity: L.enum("create", "medium", "high"),
  })
  const fileChanges = yield* L.fork(
    "group-key",
    implementationPlan.files.map((file) => implement(feat, file)),
  )
  return { fileChanges, implementationPlan }
}

function* implement(featureRequest: string, file: typeof FileInfo["T"]) {
  yield* L.system(IMPLEMENTATION_PROMPTS[file.changeType])
  yield* L.user`
    Implement the changes for ${file.filePath} to support:

    ${file.purpose}

    Consider the overall feature context:

    ${featureRequest}
  `
  const implementation = yield* L.object({
    explanation: L.string,
    code: L.string,
  })
  return { file, implementation }
}

const FileInfo = L.object({
  purpose: L.string,
  filePath: L.string,
  changeType: L.enum("create", "modify", "delete"),
})

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}
