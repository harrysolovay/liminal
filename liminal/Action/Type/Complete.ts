import type { TypeLike } from "./TypeLike.js"

export interface Complete {
  kind: "Complete"
  // Subtle differences between vtype libs cause issues; avoid specificity of JSONType interface.
  typeLike: TypeLike
}
