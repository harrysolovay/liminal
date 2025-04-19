import type { Model } from "../Model.ts"
// import type { Reference } from "../Reference.ts"

export interface ModelRemoved {
  type: "model_removed"
  // model: Reference<ModelAdapter>
}
