import type { L } from "./L.js"

export class RecursiveTypeVisitorState {
  root: L
  ids: Map<L, string>
  constructor(root: L, ids: Map<L, string>) {
    this.root = root
    this.ids = ids
  }

  id(type: L): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }
}
