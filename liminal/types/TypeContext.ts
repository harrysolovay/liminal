import type { Type } from "./Type.js"

export class TypeContext {
  root: Type
  ids: Map<Type, string>
  constructor(root: Type, ids: Map<Type, string> = new Map()) {
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
