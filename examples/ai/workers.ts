import { Branch, Agent, AssistantObject } from "liminal"
import { type } from "arktype"

export const workers = Agent("You are a senior software architect planning feature implementations.", function* () {
  const feat = prompt("Please enter a feature request.")!
  yield `
    Analyze this feature request and create an implementation plan:

    ${feat}
  `
  const implementationPlan = yield* AssistantObject(
    type({
      files: FileInfo.array(),
      estimatedComplexity: "'create' | 'medium' | 'high'",
    }),
  )
  const fileChanges = yield* Branch(implementationPlan.files.map((file, i) => Implementation(feat, file)("")))
  return { fileChanges, implementationPlan }
})

const FileInfo = type({
  purpose: "string",
  filePath: "string",
  changeType: "'create' | 'modify' | 'delete'",
})

function Implementation(featureRequest: string, file: typeof FileInfo.infer) {
  return Agent(
    {
      create: "You are an expert at implementing new files following best practices and project patterns.",
      modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
      delete: "You are an expert at safely removing code while ensuring no breaking changes.",
    }[file.changeType],
    function* () {
      yield `
        Implement the changes for ${file.filePath} to support:

        ${file.purpose}

        Consider the overall feature context:

        ${featureRequest}
      `
      const implementation = yield* AssistantObject(
        type({
          explanation: "string",
          code: "string",
        }),
      )
      return { file, implementation }
    },
  )
}
