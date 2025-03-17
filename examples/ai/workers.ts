import { branch, L, system } from "liminal"

export function* implementFeature(featureRequest: string) {
  yield* system`You are a senior software architect planning feature implementations.`
  yield `
    Analyze this feature request and create an implementation plan:

    ${featureRequest}
  `
  const implementationPlan = yield* L({
    files: L.array(
      L({
        purpose: L.string,
        filePath: L.string,
        changeType: L.enum("create", "modify", "delete"),
      }),
    ),
    estimatedComplexity: L.enum("create", "medium", "high"),
  })

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
      const implementation = yield* L({
        explanation: L.string,
        code: L.string,
      })
      return { file, implementation }
    }),
  )
  return { fileChanges, implementationPlan }
}
