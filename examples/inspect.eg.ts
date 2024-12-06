import "@std/dotenv/load"
import { T } from "structured-outputs"

const A = T.object({
  a: T.string,
})

const B = T.taggedUnion("type", {
  A,
  B: T.string,
})

console.log(B)
