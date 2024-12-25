import { AssertionError } from "@std/assert"
import { L } from "../mod.ts"
import type { Provider } from "./Adapter.ts"
import type { Liminal } from "./Liminal.ts"

export async function $assert<P extends Provider>(
  $: Liminal<P>,
  value: unknown,
  assertion: string,
): Promise<void> {
  $`
    Is the assertion "${assertion}" true for the following value?

    \`\`\`
    ${JSON.stringify(value, null, 2)}
    \`\`\
  `
  const reason = await $.value(L.Option(L.string`Reason behind the assertion failure.`))
  if (reason) {
    throw new AssertionError(reason)
  }
}
