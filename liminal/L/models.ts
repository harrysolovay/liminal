import { State } from "../Context.ts"
import { ModelRegistry } from "../ModelRegistry.ts"

export const models = State<ModelRegistry>((parent) => parent?.clone() ?? new ModelRegistry())
