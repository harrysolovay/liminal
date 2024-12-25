import type { AnyType } from "./Type.ts"

export interface Diagnostic {
  type: AnyType
  description?: string
  path: string
  value: unknown
  exception?: unknown
}

export namespace Diagnostic {
  export function toString({ description, exception, path, value }: Diagnostic): string {
    return `Assertion${description ? ` "${description}"` : ""} failed ${
      exception
        ? exception instanceof Error ? `with Error "${exception.name}"` : "with exception"
        : ""
    } on value \`${JSON.stringify(value)}\` at \`root${path}\`: ${
      exception instanceof Error ? exception.message : JSON.stringify(exception)
    }`
  }
}
