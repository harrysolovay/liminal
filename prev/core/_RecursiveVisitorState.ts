import type { Rune } from "./_Rune.ts"

export class RecursiveVisitorState {
  constructor(
    readonly root: Rune,
    readonly ids: Map<Rune, string>,
  ) {}

  id(rune: Rune): string {
    let id = this.ids.get(rune)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(rune, id)
    }
    return id
  }
}
