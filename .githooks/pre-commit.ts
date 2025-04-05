import lintStaged from "lint-staged"
import { rootDir } from "../scripts/files.mjs"

// We use lint-staged to help manage the state of staged files and to git add files after successful completion
const success = await lintStaged({
  cwd: rootDir(),
  relative: true,
  allowEmpty: true,
  concurrent: false,
  config: {
    // dprint handles all of these different file types
    "**/*.{js,ts,json,yaml,yml,tsx,md,html,svelte}": ["bun dprint fmt"],
    "**/*.{js,ts,json,lock}": async (files) => {
      if (files.length === 0) return []
      const commands: string[] = []
      if (process.argv.includes("--build")) {
        // Remove old build artifacts (old snapshots get in the way)
        await Bun.$`rm -rf packages/*/dist/* liminal/dist/*`
        commands.push("bun run build")
      }
      if (process.argv.includes("--test")) {
        console.log("Running tests...")
        commands.push("bun test")
      }
      return commands
    },
  },
})

if (!success) process.exit(1)
