import { L } from "liminal"

export default function*() {
  yield* L.user`
    I need a type that represents the data of a fantastical story world
    full of super-powered beings such as witches, vampires, werewolves and fae.
    Prefer producing complex object types.
  `
  return yield* L.fork("types", {
    *gritty() {
      return yield* yield* L.inferMetatype`Add a gritty undertone. Horrific and scary. True monsters to be feared.`
    },
    *comedic() {
      return yield* yield* L
        .inferMetatype`Make it hilarious. Identify and make fun of the goofier elements of supernatural lure.`
    },
    *romantic() {
      return yield* yield* L.inferMetatype`Make it seductive, romantic and passionate.`
    },
  })
}
