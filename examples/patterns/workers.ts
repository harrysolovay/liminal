import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Exec, fork, infer, setLanguageModel, system } from "liminal"
import { AILanguageModel } from "liminal-ai"

Exec(CodeReviewers("Alert administrators via text whenever site traffic exceeds a certain threshold.")).exec(
  console.log,
)

function* CodeReviewers(feat: string) {
  yield* system`You are a senior software architect planning feature implementations.`
  yield* setLanguageModel("default", AILanguageModel(openai("gpt-4o-mini")))
  yield "Analyze this feature request and create an implementation plan:"
  yield feat
  const implementationPlan = yield* infer(type({
    files: FileInfo.array(),
    estimatedComplexity: "'create' | 'medium' | 'high'",
  }))
  const fileChanges = yield* fork("FileChanges", implementationPlan.files.map((file) => Implementor(feat, file)))
  return { fileChanges, implementationPlan }
}

const FileInfo = type({
  purpose: "string",
  filePath: "string",
  changeType: "'create' | 'modify' | 'delete'",
})

function* Implementor(featureRequest: string, file: typeof FileInfo.infer) {
  yield* system(IMPLEMENTATION_PROMPTS[file.changeType])
  yield `
    Implement the changes for ${file.filePath} to support:

    ${file.purpose}

    Consider the overall feature context:

    ${featureRequest}
  `
  const implementation = yield* infer(type({
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
