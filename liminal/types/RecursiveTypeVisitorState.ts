import type { Type } from "./Type.js"

export class RecursiveTypeVisitorState {
  constructor(
    readonly root: Type,
    readonly ids: Map<Type, string> = new Map(),
  ) {}

  id(type: Type): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }
}
