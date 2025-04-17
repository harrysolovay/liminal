export interface tag {
  description: string | undefined
}

export function tag(description?: string): tag {
  return { description }
}
