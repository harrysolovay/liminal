import { Branch, Agent, AssistantObject } from "liminal"
import { type } from "arktype"

const File = type({
  purpose: "string",
  filePath: "string",
  changeType: "'create' | 'modify' | 'delete'",
})

function Main(featureRequest: string) {
  return Agent("", "You are a senior software architect planning feature implementations.", function* () {
    yield `
      Analyze this feature request and create an implementation plan:

      ${featureRequest}
    `
    const implementationPlan = yield* AssistantObject(
      type({
        files: File.array(),
        estimatedComplexity: "'create' | 'medium' | 'high'",
      }),
    )
    const fileChanges = yield* Branch(
      implementationPlan.files.map((file) => ImplementationPlanAgent(featureRequest, file)),
    )
    return { fileChanges, implementationPlan }
  })
}

function ImplementationPlanAgent(featureRequest: string, file: typeof File.infer) {
  return Agent(
    "",
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
