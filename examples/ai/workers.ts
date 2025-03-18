import { branch, system } from "liminal"
import { type } from "arktype"
import { from } from "liminal-arktype"

export function* implementFeature(featureRequest: string) {
  yield* system`You are a senior software architect planning feature implementations.`
  yield `
    Analyze this feature request and create an implementation plan:

    ${featureRequest}
  `
  const implementationPlan = yield* from(
    type({
      files: type({
        purpose: "string",
        filePath: "string",
        changeType: "'create' | 'modify' | 'delete'",
      }).array(),
      estimatedComplexity: "'create' | 'medium' | 'high'",
    }),
  )

  const fileChanges = yield* branch(
    ...implementationPlan.files.map(function* (file) {
      // Each worker is specialized for the type of change
      yield* system(
        {
          create: "You are an expert at implementing new files following best practices and project patterns.",
          modify:
            "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
          delete: "You are an expert at safely removing code while ensuring no breaking changes.",
        }[file.changeType],
      )
      yield `
        Implement the changes for ${file.filePath} to support:

        ${file.purpose}

        Consider the overall feature context:

        ${featureRequest}
      `
      const implementation = yield* from(
        type({
          explanation: "string",
          code: "string",
        }),
      )
      return { file, implementation }
    }),
  )
  return { fileChanges, implementationPlan }
}
