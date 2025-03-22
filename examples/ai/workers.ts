import { Branch, Agent, Assistant, Emit } from "liminal"
import { type } from "arktype"
import { exec } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

exec(workers, {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler: console.log,
})

function workers() {
  return Agent("Workers", "You are a senior software architect planning feature implementations.", function* () {
    yield "Analyze this feature request and create an implementation plan:"
    const feat = prompt("Please enter a feature request.")!
    yield feat
    const implementationPlan = yield* Assistant(
      type({
        files: FileInfo.array(),
        estimatedComplexity: "'create' | 'medium' | 'high'",
      }),
    )
    const fileChanges = yield* Branch(implementationPlan.files.map((file) => Implementation(feat, file)))
    return { fileChanges, implementationPlan }
  })
}

const FileInfo = type({
  purpose: "string",
  filePath: "string",
  changeType: "'create' | 'modify' | 'delete'",
})

function Implementation(featureRequest: string, file: typeof FileInfo.infer) {
  return Agent("Implementation", IMPLEMENTATION_PROMPTS[file.changeType], function* () {
    yield `
      Implement the changes for ${file.filePath} to support:

      ${file.purpose}

      Consider the overall feature context:

      ${featureRequest}
    `
    const implementation = yield* Assistant(
      type({
        explanation: "string",
        code: "string",
      }),
    )
    return { file, implementation }
  })
}

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}
