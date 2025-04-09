export interface _ {
  type: "_"
}

export const _: _ = {
  type: "_",
}

export function is_(value: unknown): value is _ {
  return typeof value === "object" && value !== null && "type" in value && value.type === "_"
}
