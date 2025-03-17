import type { L } from "./L.js"

export class RecursiveTypeVisitorState {
  constructor(
    readonly root: L,
    readonly ids: Map<L, string>,
  ) {}

  id(type: L): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }
}
