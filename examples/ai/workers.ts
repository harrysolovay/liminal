import { Branch, Context, Generation, exec, Scope } from "liminal"
import { type } from "arktype"
import { language } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

exec(CodeReviewers, {
  models: {
    language: {
      default: language(openai("gpt-4o-mini")),
    },
    embedding: {},
  },
  handler: console.log,
})

function CodeReviewers() {
  return Scope(
    "Workers",
    Context("You are a senior software architect planning feature implementations.", function* () {
      yield "Analyze this feature request and create an implementation plan:"
      const feat = "Alert administrators via text whenever site traffic exceeds a certain threshold."
      yield feat
      const implementationPlan = yield* Generation(
        type({
          files: FileInfo.array(),
          estimatedComplexity: "'create' | 'medium' | 'high'",
        }),
      )
      const fileChanges = yield* Branch(implementationPlan.files.map((file) => Implementor(feat, file)))
      return { fileChanges, implementationPlan }
    }),
  )
}

const FileInfo = type({
  purpose: "string",
  filePath: "string",
  changeType: "'create' | 'modify' | 'delete'",
})

function Implementor(featureRequest: string, file: typeof FileInfo.infer) {
  return Scope(
    "Implementation",
    Context(IMPLEMENTATION_PROMPTS[file.changeType], function* () {
      yield `
      Implement the changes for ${file.filePath} to support:

      ${file.purpose}

      Consider the overall feature context:

      ${featureRequest}
    `
      const implementation = yield* Generation(
        type({
          explanation: "string",
          code: "string",
        }),
      )
      return { file, implementation }
    }),
  )
}

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}
