import { assert } from "@std/assert"
import { L, type Type } from "liminal"
import * as A from "./assertions.eg.ts"

const ymd = L.assert(
  "Ensure the day is valid for corresponding year and month.",
  (ymd: [number, number, number]) => assertValidYMD(...ymd),
)

export const LDate: Type<Date, never> = L.transform(
  L.Tuple(
    L.number`Year.`,
    L.number`Month.`(
      A.number.min(0),
      A.number.max(11),
    ),
    L.number`Day.`(
      A.number.min(0),
      A.number.max(31),
    ),
  )(ymd()),
  ([y, m, d]) => new Date(y, m, d),
)

function assertValidYMD(year: number, month: number, day: number) {
  const date = new Date(year, month, day)
  assert(
    date.getFullYear() === year && date.getMonth() === month && date.getDate() === day,
    `Day ${day} is invalid for month ${month} (${MONTHS[month]}).`,
  )
}
// dprint-ignore-next-line
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]