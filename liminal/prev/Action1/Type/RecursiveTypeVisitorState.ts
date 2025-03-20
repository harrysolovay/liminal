import type { Type } from "./Type.js"

export class RecursiveTypeVisitorState {
  root: Type
  ids: Map<Type, string>
  constructor(root: Type, ids: Map<Type, string>) {
    this.root = root
    this.ids = ids
  }

  id(type: Type): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }
}
