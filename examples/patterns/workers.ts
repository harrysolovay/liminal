import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Branches, Exec, Inference, Model, SystemMessage } from "liminal"
import { AILanguageModel } from "liminal-ai"

Exec(CodeReviewers())
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
  })
  .reduce(console.log)

function* CodeReviewers() {
  yield* SystemMessage("You are a senior software architect planning feature implementations.")
  yield* Model.language("default")
  yield "Analyze this feature request and create an implementation plan:"
  const feat = "Alert administrators via text whenever site traffic exceeds a certain threshold."
  yield feat
  const implementationPlan = yield* Inference(
    type({
      files: FileInfo.array(),
      estimatedComplexity: "'create' | 'medium' | 'high'",
    }),
  )
  const fileChanges = yield* Branches("FileChanges", implementationPlan.files.map((file) => Implementor(feat, file)))
  return { fileChanges, implementationPlan }
}

const FileInfo = type({
  purpose: "string",
  filePath: "string",
  changeType: "'create' | 'modify' | 'delete'",
})

function* Implementor(featureRequest: string, file: typeof FileInfo.infer) {
  yield* SystemMessage(IMPLEMENTATION_PROMPTS[file.changeType])
  yield `
    Implement the changes for ${file.filePath} to support:

    ${file.purpose}

    Consider the overall feature context:

    ${featureRequest}
  `
  const implementation = yield* Inference(
    type({
      explanation: "string",
      code: "string",
    }),
  )
  return { file, implementation }
}

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}
